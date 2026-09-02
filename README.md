# GamerChallenge

Plateforme communautaire de défis de jeux vidéo. Projet de fin de formation
développeur web / web mobile à l'École O'clock, réalisé en équipe et soutenu
devant un jury.

## Le concept

La communauté crée des défis rattachés à un jeu (« finir ce niveau sans subir
de dégât », « meilleur temps sur cette carte »). Chaque membre soumet sa
performance avec un lien de preuve, et les autres votent — sur les défis
eux-mêmes comme sur les participations. Un classement met en avant les joueurs
les plus actifs et les plus appréciés.

## Fonctionnalités

- **Comptes** — inscription, connexion, JWT en cookie HttpOnly (7 jours),
  mots de passe hachés avec Argon2, suppression de compte anonymisante
  (soft delete).
- **Défis** — création rattachée à un jeu, édition et suppression réservées à
  l'auteur, page de détail adressée par slug.
- **Jeux** — catalogue en base ; à la création d'un défi, l'autocomplétion
  interroge l'API externe RAWG.
- **Participations** — soumission (description + URL de preuve), édition,
  suppression.
- **Votes** — un vote par utilisateur et par défi, un vote par utilisateur et
  par participation (contrainte d'unicité en base).
- **Accueil** — top défis et top jeux calculés à la volée.
- **Classement** — top 10 par nombre de participations et par likes reçus ;
  le rang de l'utilisateur connecté est calculé en une requête via le
  fenêtrage SQL `RANK()`.
- **Modération** (admin) — file des contenus signalés, approbation ou
  suppression, bannissement et débannissement d'utilisateurs.
- **Signalement** — tout membre peut signaler un défi ou une participation.
- **Pages légales** — mentions légales, CGU, politique de confidentialité,
  FAQ / support.

## Pile technique

| Couche | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 |
| Backend | Node.js · Express 5 · TypeScript · découpage routes / contrôleurs / services / middlewares |
| Base de données | PostgreSQL 18 · Prisma 7 (migrations versionnées) |
| Validation | Zod |
| Sécurité | Argon2 · JWT (cookie HttpOnly) · Helmet · CORS restreint à l'origine du client |
| API externe | RAWG (catalogue de jeux) |
| Infra | Docker + Docker Compose (api + client + PostgreSQL) |

## Architecture du dépôt

Monorepo :

```
api/                API Express + Prisma
  src/
    routes/           définition des endpoints
    controllers/      traitement des requêtes HTTP
    services/         logique métier
    middlewares/      auth, validation Zod, gestion d'erreurs, logs
    schemas/          schémas de validation Zod
  prisma/             schéma, migrations, seed
client/             application Next.js
  src/
    app/              pages (App Router)
    component/        composants réutilisables
    lib/              client API, types, contexte d'authentification
conception/         livrables de conception (MCD, charte graphique, maquettes)
compose.yml         orchestration Docker de développement
compose.prod.yml    orchestration Docker de production
```

## Lancer le projet en local

Prérequis : Docker et Docker Compose.

```bash
cp .env.example .env
# renseigner les variables (voir le tableau plus bas)
# générer un JWT_SECRET :
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

docker compose up --build
```

Au premier lancement, appliquer les migrations puis injecter le jeu de données
de démonstration :

```bash
docker compose exec api npm run db:migrate
docker compose exec api npm run seed
```

- Client : http://localhost:8008
- API : http://localhost:3000 (route de test : `GET /health`)
- PostgreSQL : `localhost:5433`

### Sans Docker

```bash
cd api    && npm install && npm run devdb   # port 3000, gère aussi les migrations
cd client && npm install && npm run dev     # port 8008
```

## Variables d'environnement

| Variable | Service | Rôle |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | db | identifiants PostgreSQL |
| `DATABASE_URL` | api | chaîne de connexion Prisma |
| `JWT_SECRET` | api | signature des jetons d'authentification |
| `RAWG_API_KEY` | api | clé de l'API RAWG (autocomplétion des jeux) |
| `FRONTEND_URL` | api | origine autorisée pour CORS |
| `COOKIE_DOMAIN` | api | domaine du cookie d'authentification |
| `NEXT_PUBLIC_API_URL` | client | URL publique de l'API |
| `NEXT_PUBLIC_BASE_URL` | client | URL publique du client |
| `API_INTERNAL_URL` | client | URL interne de l'API (rendu serveur, réseau Docker) |

## Scripts principaux

### API (`api/`)

| Commande | Effet |
|---|---|
| `npm run dev` | serveur en mode watch |
| `npm run devdb` | génère le client Prisma, applique les migrations, puis watch |
| `npm run db:migrate` | crée et applique une migration |
| `npm run db:studio` | ouvre Prisma Studio |
| `npm run seed` | injecte le jeu de données de démonstration |
| `npm run lint` / `npm run format` | ESLint / Prettier |

### Client (`client/`)

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement Next.js |
| `npm run build` / `npm run start` | build et service de production |
| `npm run lint` / `npm run format` | ESLint / Prettier |

## Contexte

Projet collectif mené en fin de formation à l'École O'clock (promotion Dublin),
sur environ un mois, en méthode agile, puis présenté à l'oral devant un jury.

## Licence

MIT — voir [LICENSE](LICENSE).
