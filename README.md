# GamerChallenges

Plateforme communautaire de défis de jeux vidéo.

## Stack technique

- **Frontend** : Next.js 15, React, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express, TypeScript, Prisma
- **Base de données** : PostgreSQL 18
- **Conteneurisation** : Docker, Docker Compose

## Prérequis

- Docker & Docker Compose
- Node.js 24+ (pour dev local)
- Git

## Installation

1. Clone le repo

```bash
git clone <url>
cd gamerchallenge
```

2. Copie le fichier d'environnement

```bash
cp .env.example .env
```

3. Génère les secrets

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Lance Docker

```bash
docker compose up --build
```

5. Crée la base de données

```bash
cd api
npm run db:generate
npx prisma migrate dev
```

## Accès

- **Frontend** : http://localhost:8008
- **API** : http://localhost:3000
- **Base de données** : localhost:5433

## Scripts utiles

### API

```bash
cd api
npm run dev          # Lance le serveur en mode watch
npm run lint         # Vérifie le code
npm run lint:fix     # Corrige les erreurs
npm run format       # Formate le code
```

### Client

```bash
cd client
npm run dev          # Lance Next.js
npm run lint         # Vérifie le code
npm run format       # Formate le code
```

## Structure du projet

```
gamerchallenge/
├── api/           # Backend Express + Prisma
├── client/        # Frontend Next.js
├── compose.yml    # Configuration Docker
└── .env           # Variables d'environnement (non committé)
```

## Contribution

1. Crée une branche depuis `dev`
2. Fais tes modifications
3. Lance `npm run lint && npm run format`
4. Commit et push
5.
6. Ouvre une Pull Request vers `dev`
