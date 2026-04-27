import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting massive seed...');

  // Nettoyer la base
  await prisma.participationVote.deleteMany();
  await prisma.challengeVote.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // Créer 15 users (plus de diversité)
  const hashedPassword = await argon2.hash('Test1234!');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: { email: 'bob@example.com', username: 'bob', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        username: 'charlie',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        username: 'diana',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: { email: 'eve@example.com', username: 'eve', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: {
        email: 'frank@example.com',
        username: 'frank',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'grace@example.com',
        username: 'grace',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'henry@example.com',
        username: 'henry',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: { email: 'iris@example.com', username: 'iris', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: { email: 'jack@example.com', username: 'jack', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: { email: 'kate@example.com', username: 'kate', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: { email: 'leo@example.com', username: 'leo', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: { email: 'maya@example.com', username: 'maya', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: { email: 'noah@example.com', username: 'noah', password: hashedPassword, role: 'USER' }
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Créer 30 jeux (IDs réels de RAWG API)
  const games = await Promise.all([
    prisma.game.create({
      data: {
        id: '3498',
        slug: 'grand-theft-auto-v',
        title: 'Grand Theft Auto V',
        imageUrl: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3328',
        slug: 'the-witcher-3-wild-hunt',
        title: 'The Witcher 3: Wild Hunt',
        imageUrl: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '4200',
        slug: 'portal-2',
        title: 'Portal 2',
        imageUrl: 'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '5286',
        slug: 'tomb-raider',
        title: 'Tomb Raider (2013)',
        imageUrl: 'https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '13536',
        slug: 'portal',
        title: 'Portal',
        imageUrl: 'https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '4291',
        slug: 'counter-strike-global-offensive',
        title: 'Counter-Strike: Global Offensive',
        imageUrl: 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '5679',
        slug: 'the-elder-scrolls-v-skyrim',
        title: 'The Elder Scrolls V: Skyrim',
        imageUrl: 'https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '12020',
        slug: 'left-4-dead-2',
        title: 'Left 4 Dead 2',
        imageUrl: 'https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '326243',
        slug: 'elden-ring',
        title: 'Elden Ring',
        imageUrl: 'https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '802',
        slug: 'borderlands-2',
        title: 'Borderlands 2',
        imageUrl: 'https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f140cc4825868e858cb.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '28',
        slug: 'red-dead-redemption-2',
        title: 'Red Dead Redemption 2',
        imageUrl: 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3439',
        slug: 'life-is-strange',
        title: 'Life is Strange',
        imageUrl: 'https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '1030',
        slug: 'limbo',
        title: 'Limbo',
        imageUrl: 'https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '23027',
        slug: 'the-walking-dead',
        title: 'The Walking Dead',
        imageUrl: 'https://media.rawg.io/media/games/8d6/8d69eb6c32ed6acfd75f82d532144993.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '58175',
        slug: 'god-of-war-2018',
        title: 'God of War (2018)',
        imageUrl: 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '22509',
        slug: 'minecraft',
        title: 'Minecraft',
        imageUrl: 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3272',
        slug: 'rocket-league',
        title: 'Rocket League',
        imageUrl: 'https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3070',
        slug: 'fallout-4',
        title: 'Fallout 4',
        imageUrl: 'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '12447',
        slug: 'dark-souls',
        title: 'Dark Souls',
        imageUrl: 'https://media.rawg.io/media/games/559/559bc0768f656ad0c63c54b80a82d680.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '41494',
        slug: 'cyberpunk-2077',
        title: 'Cyberpunk 2077',
        imageUrl: 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '32',
        slug: 'destiny-2',
        title: 'Destiny 2',
        imageUrl: 'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '58134',
        slug: 'marvels-spider-man',
        title: "Marvel's Spider-Man",
        imageUrl: 'https://media.rawg.io/media/games/9aa/9aa42d16d425fa6f179fc9dc2f763647.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '19487',
        slug: 'alan-wake',
        title: 'Alan Wake',
        imageUrl: 'https://media.rawg.io/media/games/5c0/5c0dd63002cb23f804aab327d40ef119.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '422',
        slug: 'terraria',
        title: 'Terraria',
        imageUrl: 'https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3192',
        slug: 'ori-and-the-blind-forest',
        title: 'Ori and the Blind Forest',
        imageUrl: 'https://media.rawg.io/media/games/5bf/5bf88a28de96321c86561a65ee48e6c2.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '1447',
        slug: 'deus-ex-human-revolution',
        title: 'Deus Ex: Human Revolution',
        imageUrl: 'https://media.rawg.io/media/games/c6b/c6bfece1daf8d06bc0a60632ac78e5bf.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '11936',
        slug: 'resident-evil-4',
        title: 'Resident Evil 4',
        imageUrl: 'https://media.rawg.io/media/games/053/053fc543bf488349610f1ae2d0c1b51b.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '290856',
        slug: 'apex-legends',
        title: 'Apex Legends',
        imageUrl: 'https://media.rawg.io/media/games/b72/b7233d5d5b1e75e86bb860ccc7aeca85.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '362',
        slug: 'for-honor',
        title: 'For Honor',
        imageUrl: 'https://media.rawg.io/media/games/4e0/4e0e7b6d6906a131307c94266e5c9a1c.jpg'
      }
    })
  ]);

  console.log(`✅ Created ${games.length} games`);

  // Créer 75 challenges (2-3 par jeu, variété de scoreFormat)
const challenges = [];
const challengeData = [
  // GTA V
  {
    game: 0,
    title: "Complete Story Mode",
    slug: "gta5-complete-story",
    format: "boolean",
    desc: "Finish all story missions",
    details: [
      "Finish all main story missions (A/B/C).",
      "No mission skips (optional).",
      "Any% story completion accepted.",
    ],
  },
  {
    game: 0,
    title: "Under the Bridge Speedrun",
    slug: "gta5-bridge-speed",
    format: "time",
    desc: "Complete all under the bridge challenges",
    details: [
      "Start timing at first bridge entry.",
      "Finish timing after the last bridge is cleared.",
      "No cheats; any vehicle allowed.",
      "Submit final time in mm:ss.",
    ],
  },
  {
    game: 0,
    title: "Stunt Jump Master",
    slug: "gta5-stunt-jumps",
    format: "score",
    desc: "Complete maximum stunt jumps",
    details: [
      "Count only unique stunt jumps completed.",
      "Screenshot/clip proof recommended.",
      "Score = number of stunt jumps completed.",
    ],
  },

  // Witcher 3
  {
    game: 1,
    title: "Death March Completion",
    slug: "witcher3-death-march",
    format: "boolean",
    desc: "Beat the game on Death March",
    details: [
      "Difficulty must be Death March from start to finish.",
      "Main story completion required.",
      "No lowering difficulty mid-run.",
    ],
  },
  {
    game: 1,
    title: "Gwent Collector",
    slug: "witcher3-gwent",
    format: "score",
    desc: "Collect all Gwent cards",
    details: [
      "Score = number of unique cards collected.",
      "Include base game (DLC optional).",
      "Proof: collection screen screenshot(s).",
    ],
  },

  // Portal 2
  {
    game: 2,
    title: "Co-op Speedrun",
    slug: "portal2-coop-speed",
    format: "time",
    desc: "Complete co-op campaign fast",
    details: [
      "Full co-op campaign required.",
      "Time ends at final completion screen.",
      "Glitches allowed unless stated otherwise.",
    ],
  },
  {
    game: 2,
    title: "No Portal Bumps",
    slug: "portal2-no-bumps",
    format: "boolean",
    desc: "Complete without hitting walls",
    details: [
      "No collisions against walls/ceilings during movement.",
      "Accidental micro-bumps invalidate the run.",
      "Clip proof recommended.",
    ],
  },

  // Tomb Raider
  {
    game: 3,
    title: "Relic Hunter",
    slug: "tombraider-relics",
    format: "score",
    desc: "Find all relics",
    details: [
      "Score = total relics found.",
      "Optional documents don’t count.",
      "Proof: collectibles screen screenshot.",
    ],
  },
  {
    game: 3,
    title: "Bow Only Run",
    slug: "tombraider-bow-only",
    format: "boolean",
    desc: "Complete using only bow",
    details: [
      "Combat kills must be with the bow only.",
      "Environmental kills allowed if forced by the game.",
      "Main story completion required.",
    ],
  },

  // Portal
  {
    game: 4,
    title: "Portal Speedrun Any%",
    slug: "portal-speedrun",
    format: "time",
    desc: "Beat the game as fast as possible",
    details: [
      "Any% completion accepted.",
      "Time ends on final cutscene trigger.",
      "Submit time in mm:ss or hh:mm:ss.",
    ],
  },
  {
    game: 4,
    title: "Least Portals Challenge",
    slug: "portal-least-portals",
    format: "score",
    desc: "Complete with minimum portals",
    details: [
      "Score = total portals placed (lower is better).",
      "Must finish the game.",
      "Proof: end stats screenshot if available.",
    ],
  },

  // CS:GO
  {
    game: 5,
    title: "Ace Challenge",
    slug: "csgo-ace",
    format: "score",
    desc: "Get maximum aces in competitive",
    details: [
      "Score = number of aces in official competitive matches.",
      "No custom servers.",
      "Proof: match history / demo links recommended.",
    ],
  },
  {
    game: 5,
    title: "Deagle Only Wins",
    slug: "csgo-deagle-wins",
    format: "score",
    desc: "Win rounds using only deagle",
    details: [
      "Score = rounds won where you only used Desert Eagle.",
      "Knife usage allowed for movement only (no damage).",
      "Proof: demo or clip recommended.",
    ],
  },

  // Skyrim
  {
    game: 6,
    title: "All Daedric Artifacts",
    slug: "skyrim-daedric",
    format: "boolean",
    desc: "Collect all Daedric artifacts",
    details: [
      "Collect every Daedric artifact in one save.",
      "Artifacts gained via quests only.",
      "Proof: inventory screenshot(s).",
    ],
  },
  {
    game: 6,
    title: "Level 100 No Exploits",
    slug: "skyrim-level100",
    format: "boolean",
    desc: "Reach level 100 legitimately",
    details: [
      "Reach level 100 without known exploit loops.",
      "No console commands.",
      "Proof: character stats screenshot.",
    ],
  },
  {
    game: 6,
    title: "Dragon Kill Count",
    slug: "skyrim-dragons",
    format: "score",
    desc: "Kill maximum dragons",
    details: [
      "Score = number of dragons killed.",
      "Any dragon type counts.",
      "Proof: stats / kill count screenshot recommended.",
    ],
  },

  // Left 4 Dead 2
  {
    game: 7,
    title: "Expert Realism No Death",
    slug: "l4d2-expert-nodeath",
    format: "boolean",
    desc: "Complete campaign without dying",
    details: [
      "Expert + Realism mode required.",
      "No player deaths during the campaign.",
      "Any official campaign allowed unless specified.",
    ],
  },
  {
    game: 7,
    title: "Melee Only Campaign",
    slug: "l4d2-melee-only",
    format: "boolean",
    desc: "Complete using only melee",
    details: [
      "Damage must come from melee weapons only.",
      "Throwable items not allowed.",
      "Campaign completion required.",
    ],
  },

  // Elden Ring
  {
    game: 8,
    title: "All Remembrances",
    slug: "eldenring-remembrances",
    format: "boolean",
    desc: "Defeat all remembrance bosses",
    details: [
      "Defeat every boss that grants a Remembrance.",
      "NG or NG+ both accepted.",
      "Proof: inventory / achievement screenshots.",
    ],
  },
  {
    game: 8,
    title: "Level 1 Completion",
    slug: "eldenring-level1",
    format: "boolean",
    desc: "Beat the game at level 1",
    details: [
      "Finish the game without leveling up.",
      "Any starting class allowed (must stay level 1).",
      "Summons allowed unless you forbid them.",
    ],
  },
  {
    game: 8,
    title: "Speedrun Any%",
    slug: "eldenring-speedrun",
    format: "time",
    desc: "Complete as fast as possible",
    details: [
      "Any% completion accepted.",
      "Time ends at final boss defeat.",
      "Glitches allowed unless specified otherwise.",
      "Submit time in hh:mm:ss.",
    ],
  },

  // Borderlands 2
  {
    game: 9,
    title: "Legendary Loot Hunter",
    slug: "bl2-legendary",
    format: "score",
    desc: "Collect legendary items",
    details: [
      "Score = number of unique legendary items found.",
      "Duplicates don’t add points.",
      "Proof: inventory screenshots recommended.",
    ],
  },
  {
    game: 9,
    title: "OP10 Solo Clear",
    slug: "bl2-op10-solo",
    format: "boolean",
    desc: "Clear OP10 solo",
    details: [
      "Clear OP10 content solo (no co-op).",
      "No modded gear.",
      "Proof: completion screen / clip recommended.",
    ],
  },

  // RDR2
  {
    game: 10,
    title: "100% Completion",
    slug: "rdr2-100percent",
    format: "boolean",
    desc: "Achieve 100% completion",
    details: [
      "Reach 100% in the in-game completion tracker.",
      "Single-player only.",
      "Proof: completion screen screenshot.",
    ],
  },
  {
    game: 10,
    title: "Sharpshooter Challenge",
    slug: "rdr2-sharpshooter",
    format: "score",
    desc: "Complete sharpshooter challenges",
    details: [
      "Score = number of Sharpshooter challenges completed.",
      "Single-player only.",
      "Proof: challenges menu screenshot.",
    ],
  },
  {
    game: 10,
    title: "Horseback Archery",
    slug: "rdr2-horse-archery",
    format: "score",
    desc: "Kill enemies from horseback with bow",
    details: [
      "Score = kills achieved while mounted with a bow.",
      "NPC enemies only (no animals).",
      "Proof: clip recommended for high scores.",
    ],
  },

  // Life is Strange
  {
    game: 11,
    title: "All Collectibles",
    slug: "lis-collectibles",
    format: "boolean",
    desc: "Find all optional photos",
    details: [
      "Collect all optional photos in one playthrough/save.",
      "Any difficulty.",
      "Proof: collectibles/chapters screen screenshot.",
    ],
  },
  {
    game: 11,
    title: "Pacifist Run",
    slug: "lis-pacifist",
    format: "boolean",
    desc: "Make peaceful choices",
    details: [
      "Always pick the most peaceful option when available.",
      "No intentional harm choices.",
      "Finish the story.",
    ],
  },

  // Limbo
  {
    game: 12,
    title: "No Death Run",
    slug: "limbo-no-death",
    format: "boolean",
    desc: "Complete without dying",
    details: [
      "Finish the game with zero deaths.",
      "Any% completion accepted.",
      "Proof: full run VOD recommended.",
    ],
  },
  {
    game: 12,
    title: "Limbo Speedrun",
    slug: "limbo-speedrun",
    format: "time",
    desc: "Beat the game quickly",
    details: [
      "Any% completion accepted.",
      "Time ends at final scene trigger.",
      "Submit time in mm:ss.",
    ],
  },

  // Walking Dead
  {
    game: 13,
    title: "All Achievements",
    slug: "twd-achievements",
    format: "boolean",
    desc: "Unlock all achievements",
    details: [
      "Unlock every achievement/trophy for the game.",
      "Any platform accepted.",
      "Proof: achievements list screenshot.",
    ],
  },
  {
    game: 13,
    title: "Moral Dilemmas",
    slug: "twd-moral",
    format: "score",
    desc: "Make tough choices",
    details: [
      "Score = number of major moral dilemma decisions made.",
      "Explain your choices in your submission.",
      "No wrong answers—just commit!",
    ],
  },

  // God of War
  {
    game: 14,
    title: "Give Me God of War Difficulty",
    slug: "gow-gmgow",
    format: "boolean",
    desc: "Beat on hardest difficulty",
    details: [
      "Difficulty must be GMGOW for the whole run.",
      "Main story completion required.",
      "No difficulty changes mid-game.",
    ],
  },
  {
    game: 14,
    title: "All Valkyries Defeated",
    slug: "gow-valkyries",
    format: "boolean",
    desc: "Defeat all Valkyries",
    details: [
      "Defeat every Valkyrie boss.",
      "Any gear level allowed.",
      "Proof: trophies/quest log screenshot.",
    ],
  },
  {
    game: 14,
    title: "God of War Speedrun Any%",
    slug: "gow-speedrun",
    format: "time",
    desc: "Complete quickly",
    details: [
      "Any% completion accepted.",
      "Time ends at final credits trigger.",
      "Submit time in hh:mm:ss.",
    ],
  },

  // Minecraft
  {
    game: 15,
    title: "Hardcore 100 Days",
    slug: "minecraft-hardcore100",
    format: "boolean",
    desc: "Survive 100 days in hardcore",
    details: [
      "Hardcore mode only.",
      "Survive 100 in-game days.",
      "Proof: F3 screen / day counter evidence.",
    ],
  },
  {
    game: 15,
    title: "Dragon Egg Collection",
    slug: "minecraft-dragon-eggs",
    format: "score",
    desc: "Collect dragon eggs",
    details: [
      "Score = number of dragon eggs collected.",
      "No creative mode.",
      "Proof: inventory + world screenshot.",
    ],
  },
  {
    game: 15,
    title: "Speedrun Random Seed",
    slug: "minecraft-speedrun",
    format: "time",
    desc: "Beat with random seed",
    details: [
      "Random seed required.",
      "Time ends on Ender Dragon death.",
      "Submit time in mm:ss or hh:mm:ss.",
    ],
  },

  // Rocket League
  {
    game: 16,
    title: "Aerial Goals Challenge",
    slug: "rl-aerial-goals",
    format: "score",
    desc: "Score aerial goals",
    details: [
      "Score = aerial goals scored in ranked.",
      "Casual matches allowed if you specify.",
      "Proof: match history screenshot recommended.",
    ],
  },
  {
    game: 16,
    title: "Grand Champion Rank",
    slug: "rl-gc-rank",
    format: "boolean",
    desc: "Reach Grand Champion",
    details: [
      "Reach GC rank in any ranked playlist.",
      "Current season only (recommended).",
      "Proof: rank screenshot.",
    ],
  },

  // Fallout 4
  {
    game: 17,
    title: "All Factions Completed",
    slug: "fo4-factions",
    format: "boolean",
    desc: "Complete all faction questlines",
    details: [
      "Complete the main questline with one faction.",
      "Finish major quest arcs for remaining factions where possible.",
      "Proof: quest log screenshots.",
    ],
  },
  {
    game: 17,
    title: "Settlement Builder",
    slug: "fo4-settlements",
    format: "score",
    desc: "Build maximum settlements",
    details: [
      "Score = number of settlements developed.",
      "Count only settlements with basic amenities.",
      "Proof: map / workshop screenshots.",
    ],
  },
  {
    game: 17,
    title: "Survival Mode Complete",
    slug: "fo4-survival",
    format: "boolean",
    desc: "Beat on survival difficulty",
    details: [
      "Survival difficulty required.",
      "Main quest completion.",
      "No difficulty changes mid-run.",
    ],
  },

  // Dark Souls
  {
    game: 18,
    title: "SL1 No Hit",
    slug: "ds1-sl1-nohit",
    format: "boolean",
    desc: "Beat at SL1 without being hit",
    details: [
      "Start as level 1 and never level up.",
      "No damage taken from any source.",
      "All bosses completion recommended.",
      "Full run VOD strongly recommended.",
    ],
  },
  {
    game: 18,
    title: "All Bosses Speedrun",
    slug: "ds1-allbosses-speed",
    format: "time",
    desc: "Defeat all bosses quickly",
    details: [
      "All bosses must be defeated.",
      "Time ends on last boss kill.",
      "Glitches allowed unless stated otherwise.",
    ],
  },

  // Cyberpunk 2077
  {
    game: 19,
    title: "All Endings Unlocked",
    slug: "cp2077-endings",
    format: "boolean",
    desc: "See all possible endings",
    details: [
      "Unlock and view all distinct endings.",
      "Base game endings required; DLC optional.",
      "Proof: save files / achievement screenshots.",
    ],
  },
  {
    game: 19,
    title: "Legendary Gear Collection",
    slug: "cp2077-legendary",
    format: "score",
    desc: "Collect legendary items",
    details: [
      "Score = number of unique legendary items collected.",
      "Crafted legendaries count if obtained legitimately.",
      "Proof: inventory screenshots recommended.",
    ],
  },

  // Destiny 2
  {
    game: 20,
    title: "Raid Flawless Run",
    slug: "d2-raid-flawless",
    format: "boolean",
    desc: "Complete raid without deaths",
    details: [
      "Full raid completion with zero deaths.",
      "Any raid accepted (specify which).",
      "Proof: raid report / clip recommended.",
    ],
  },
  {
    game: 20,
    title: "Crucible K/D Challenge",
    slug: "d2-crucible-kd",
    format: "score",
    desc: "Achieve high K/D ratio",
    details: [
      "Score = your K/D over a session (specify match count).",
      "Only Crucible matches count.",
      "Proof: tracker screenshot recommended.",
    ],
  },
  {
    game: 20,
    title: "Exotic Collector",
    slug: "d2-exotics",
    format: "score",
    desc: "Collect exotic weapons",
    details: [
      "Score = number of exotic weapons collected.",
      "Armor exotics don’t count (unless you want).",
      "Proof: collections screenshot.",
    ],
  },

  // MGS V
  {
    game: 21,
    title: "S-Rank All Missions",
    slug: "mgsv-srank-all",
    format: "boolean",
    desc: "Get S-rank on all missions",
    details: [
      "Earn S-rank on every main mission.",
      "No offline mods.",
      "Proof: mission list screenshot.",
    ],
  },
  {
    game: 21,
    title: "No Reflex Mode",
    slug: "mgsv-no-reflex",
    format: "boolean",
    desc: "Complete without reflex mode",
    details: [
      "Disable Reflex Mode in settings.",
      "Complete the story (or specified missions).",
      "Proof: settings screenshot recommended.",
    ],
  },

  // Spider-Man
  {
    game: 22,
    title: "All Crimes Stopped",
    slug: "spiderman-crimes",
    format: "score",
    desc: "Stop all random crimes",
    details: [
      "Score = crimes stopped in free roam.",
      "Story progress doesn’t matter.",
      "Proof: district completion screenshots.",
    ],
  },
  {
    game: 22,
    title: "Perfect Combat Score",
    slug: "spiderman-combat",
    format: "score",
    desc: "Achieve perfect combat chains",
    details: [
      "Score = longest uninterrupted combo chain.",
      "No damage taken preferred (optional).",
      "Proof: clip recommended.",
    ],
  },

  // Alan Wake
  {
    game: 23,
    title: "Nightmare Difficulty",
    slug: "alanwake-nightmare",
    format: "boolean",
    desc: "Beat on Nightmare",
    details: [
      "Nightmare difficulty required.",
      "Main story completion required.",
      "No difficulty changes mid-run.",
    ],
  },
  {
    game: 23,
    title: "Manuscript Collector",
    slug: "alanwake-manuscripts",
    format: "score",
    desc: "Find all manuscripts",
    details: [
      "Score = pages found.",
      "Include base game pages only (DLC optional).",
      "Proof: collectibles screen screenshot.",
    ],
  },

  // Terraria
  {
    game: 24,
    title: "All Bosses Defeated",
    slug: "terraria-bosses",
    format: "boolean",
    desc: "Defeat every boss",
    details: [
      "Defeat all bosses in one world.",
      "Any difficulty.",
      "Proof: boss checklist / trophies screenshot.",
    ],
  },
  {
    game: 24,
    title: "Building Contest",
    slug: "terraria-building",
    format: "score",
    desc: "Create impressive builds",
    details: [
      "Score = community/jury rating (define scale).",
      "Build must be made in survival (recommended).",
      "Share screenshots from multiple angles.",
    ],
  },

  // Ori
  {
    game: 25,
    title: "One Life Mode",
    slug: "ori-onelife",
    format: "boolean",
    desc: "Complete in one life mode",
    details: [
      "One Life mode required.",
      "Finish the full game.",
      "Proof: completion screen screenshot.",
    ],
  },
  {
    game: 25,
    title: "Ori Speedrun",
    slug: "ori-speedrun",
    format: "time",
    desc: "Complete quickly",
    details: [
      "Any% completion accepted.",
      "Time ends at final cutscene trigger.",
      "Submit time in mm:ss.",
    ],
  },

  // Deus Ex
  {
    game: 26,
    title: "Pacifist Ghost Run",
    slug: "deusex-pacifist-ghost",
    format: "boolean",
    desc: "No kills, no detection",
    details: [
      "No kills (including indirect).",
      "No alarms / detections.",
      "Finish the main story.",
      "Proof: mission summaries/screenshots.",
    ],
  },
  {
    game: 26,
    title: "Deus Ex All Achievements",
    slug: "deusex-achievements",
    format: "boolean",
    desc: "Unlock everything",
    details: [
      "Unlock all achievements/trophies.",
      "Any platform accepted.",
      "Proof: achievements list screenshot.",
    ],
  },

  // RE4
  {
    game: 27,
    title: "Professional Difficulty",
    slug: "re4-professional",
    format: "boolean",
    desc: "Beat on Professional",
    details: [
      "Professional difficulty required.",
      "Main story completion required.",
      "No difficulty changes mid-run.",
    ],
  },
  {
    game: 27,
    title: "Handcannon Unlock",
    slug: "re4-handcannon",
    format: "boolean",
    desc: "Unlock infinite handcannon",
    details: [
      "Unlock the Handcannon legitimately.",
      "No external save editors.",
      "Proof: weapon inventory screenshot.",
    ],
  },

  // Apex Legends
  {
    game: 28,
    title: "4K Damage Badge",
    slug: "apex-4k-damage",
    format: "score",
    desc: "Deal 4000 damage in one match",
    details: [
      "Score = damage dealt in a single match.",
      "Must be in a public match (ranked or pubs).",
      "Proof: end-of-match screen screenshot.",
    ],
  },
  {
    game: 28,
    title: "Win Streak",
    slug: "apex-winstreak",
    format: "score",
    desc: "Consecutive wins",
    details: [
      "Score = consecutive wins without a loss.",
      "Any mode allowed (specify).",
      "Proof: match history screenshot recommended.",
    ],
  },

  // For Honor (garde game: 28 comme dans ton code)
  {
    game: 28,
    title: "Reputation 70",
    slug: "forhonor-rep70",
    format: "boolean",
    desc: "Reach reputation 70 on one hero",
    details: [
      "Reach Rep 70 on a single hero.",
      "Any mode counts.",
      "Proof: hero screen screenshot.",
    ],
  },
  {
    game: 28,
    title: "Duel Tournament Winner",
    slug: "forhonor-tournament",
    format: "boolean",
    desc: "Win ranked duel tournament",
    details: [
      "Win a ranked duel tournament.",
      "No disconnect abuse.",
      "Proof: end screen / rank update screenshot.",
    ],
  },
];

for (const cd of challengeData) {
  challenges.push(
    await prisma.challenge.create({
      data: {
        title: cd.title,
        slug: cd.slug,
        scoreFormat: cd.format,
        description: `${cd.desc}\n\nDetails:\n${cd.details.join('\n')}`,
        gameId: games[cd.game].id,
        createdBy: users[cd.game % users.length].id,
      },
    })
  );
}

console.log(`✅ Created ${challenges.length} challenges`);


  // Créer 200+ participations (distribution variable)
  const participations = [];
  let participationCount = 0;

  // Distribution intelligente : challenges populaires vs. niche
  const popularChallenges = [0, 1, 8, 9, 10, 18, 19, 20, 24, 34, 35, 36, 44, 45]; // Indices

  // Challenges populaires : 8-12 participations chacun
  for (const challengeIdx of popularChallenges) {
    const numParticipations = 8 + Math.floor(Math.random() * 5); // 8-12
    for (let i = 0; i < numParticipations; i++) {
      participations.push(
        await prisma.participation.create({
          data: {
            submissionUrl: `https://youtube.com/watch?v=${participationCount++}`,
            description: `Participation ${participationCount}`,
            userId: users[i % users.length].id,
            challengeId: challenges[challengeIdx].id
          }
        })
      );
    }
  }

  // Challenges moyens : 3-6 participations
  for (let i = 0; i < challenges.length; i++) {
    if (!popularChallenges.includes(i)) {
      const numParticipations = 3 + Math.floor(Math.random() * 4); // 3-6
      for (let j = 0; j < numParticipations; j++) {
        participations.push(
          await prisma.participation.create({
            data: {
              submissionUrl: `https://youtube.com/watch?v=${participationCount++}`,
              description: `Participation for ${challenges[i].title}`,
              userId: users[j % users.length].id,
              challengeId: challenges[i].id
            }
          })
        );
      }
    }
  }

  console.log(`✅ Created ${participations.length} participations`);

  // Créer votes sur participations (distribution réaliste)
  const participationVotes = [];
  for (let i = 0; i < participations.length; i++) {
    // Certaines participations sont très populaires
    const isPopular = i % 10 === 0;
    const numVotes = isPopular
      ? 8 + Math.floor(Math.random() * 6)
      : 1 + Math.floor(Math.random() * 4);

    for (let j = 0; j < numVotes; j++) {
      const voterIdx = (i + j + 1) % users.length;
      try {
        participationVotes.push(
          await prisma.participationVote.create({
            data: {
              userId: users[voterIdx].id,
              participationId: participations[i].id
            }
          })
        );
      } catch (e) {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Created ${participationVotes.length} participation votes`);

  // Créer votes sur challenges
  const challengeVotes = [];
  for (let i = 0; i < challenges.length; i++) {
    const numVotes = 2 + Math.floor(Math.random() * 8); // 2-9 votes par challenge

    for (let j = 0; j < numVotes; j++) {
      const voterIdx = (i + j) % users.length;
      try {
        challengeVotes.push(
          await prisma.challengeVote.create({
            data: {
              userId: users[voterIdx].id,
              challengeId: challenges[i].id
            }
          })
        );
      } catch (e) {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Created ${challengeVotes.length} challenge votes`);

  console.log('🎉 Massive seed completed!');
  console.log(`📊 Stats:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${games.length} games`);
  console.log(`   - ${challenges.length} challenges`);
  console.log(`   - ${participations.length} participations`);
  console.log(`   - ${participationVotes.length} participation votes`);
  console.log(`   - ${challengeVotes.length} challenge votes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
