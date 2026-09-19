import { Player, TestResult, Tester, StaffMember, Announcement, ServerConfig, Gamemode, UserAccount, TierRank } from '../types';

export const ALL_TIERS_ORDER: TierRank[] = [
  'HT1', 'MT1', 'LT1',
  'HT2', 'MT2', 'LT2',
  'HT3', 'MT3', 'LT3',
  'HT4', 'MT4', 'LT4',
  'HT5', 'MT5', 'LT5'
];

export const TIER_POINTS: Record<TierRank, number> = {
  HT1: 50,
  MT1: 48,
  LT1: 45,
  HT2: 35,
  MT2: 33,
  LT2: 30,
  HT3: 25,
  MT3: 20,
  LT3: 15,
  HT4: 10,
  MT4: 7,
  LT4: 5,
  HT5: 3,
  MT5: 2,
  LT5: 1,
  Unranked: 0,
  Untested: 0
};

export function getPlayerPoints(player: Player): number {
  if (!player?.tiers) return player?.points ?? 0;
  const values = Object.values(player.tiers).map((t) => TIER_POINTS[t] ?? 0);
  return Math.max(0, ...values);
}

export const INITIAL_GAMEMODES: { id: Gamemode; name: string; icon: string; description: string; testQueueCount: number }[] = [
  { id: 'Bedfight', name: 'Bedfight', icon: 'Bed', description: 'Fast-paced bridging, bed defense, game sense, and sprint-reset PvP mechanics.', testQueueCount: 0 },
  { id: 'Skywars', name: 'Skywars', icon: 'Cloud', description: 'Loot routing, rod combos, projectile accuracy, and void positioning.', testQueueCount: 0 },
  { id: 'Mace', name: 'Mace', icon: 'Hammer', description: 'Wind charge height maximization, critical smash timing, and aerial trajectory reads.', testQueueCount: 0 },
  { id: 'Fireball Fight', name: 'Fireball Fight', icon: 'Flame', description: 'Fireball aim, projectile timing, knockback control, and close-range dueling.', testQueueCount: 0 },
];

// Official owner display name for the platform master admin account
export const OWNER_IGN = 'Bedrock Union Owner';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'valtrox51@gmail.com',
    password: 'ValtroxSystemX1',
    ign: OWNER_IGN,
    discordTag: 'valtrox.owner',
    rank: 'Owner',
    createdAt: '2025-01-01'
  }
];

export const INITIAL_PLAYERS: Player[] = [];

export const INITIAL_TEST_RESULTS: TestResult[] = [];

export const INITIAL_TESTERS: Tester[] = [];

export const INITIAL_STAFF: StaffMember[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: 'Season 1 Standardized Bedrock Tier Testing is Live!',
    category: 'Update',
    content: `Welcome to the official Bedrock Union Competitive Gaming Platform! 
Official 1v1 testing and calibration is open for Bedfight, Skywars, Mace, and Fireball Fight.

Join our official Discord community to queue with certified evaluators.`,
    summary: 'Testing queues are officially open for Bedfight, Skywars, Mace, and Fireball Fight on Discord.',
    author: OWNER_IGN,
    authorRole: 'Owner',
    date: '2025-03-01',
    pinned: true,
    views: 120,
    tags: ['Testing', 'Bedfight', 'Skywars', 'Mace', 'Fireball Fight']
  }
];

// Official "Bedrock Union" Discord invite - single source of truth for the whole platform
export const OFFICIAL_DISCORD_INVITE = 'https://discord.gg/tV9vrAeJHH';

export const INITIAL_SERVER_CONFIG: ServerConfig = {
  serverName: 'SwimGG',
  testingStatus: 'Open',
  activeSeason: 'Season 1 (Bedrock Competitive)',
  discordUrl: OFFICIAL_DISCORD_INVITE,
  discordMembers: 212,
  onlineMembers: 43,
  totalTestsConducted: 0,
  totalRegisteredPlayers: 0,
  scrimsHosted: 0,
  rulesVersion: 'v1.0'
};