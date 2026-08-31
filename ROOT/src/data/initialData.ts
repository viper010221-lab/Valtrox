import { Player, TestResult, Tester, StaffMember, Announcement, ServerConfig, Gamemode, UserAccount, TierRank } from '../types';

export const ALL_TIERS_ORDER: TierRank[] = [
  'HT1', 'MT1', 'LT1',
  'HT2', 'MT2', 'LT2',
  'HT3', 'MT3', 'LT3',
  'HT4', 'MT4', 'LT4',
  'HT5', 'MT5', 'LT5'
];

export const INITIAL_GAMEMODES: { id: Gamemode; name: string; icon: string; description: string; testQueueCount: number }[] = [
  { id: 'Bedfight', name: 'Bedfight', icon: 'Bed', description: 'Fast-paced bridging, bed defense, game sense, and sprint-reset PvP mechanics.', testQueueCount: 0 },
  { id: 'Skywars', name: 'Skywars', icon: 'Cloud', description: 'Loot routing, rod combos, projectile accuracy, and void positioning.', testQueueCount: 0 },
  { id: 'Mace', name: 'Mace', icon: 'Hammer', description: 'Wind charge height maximization, critical smash timing, and aerial trajectory reads.', testQueueCount: 0 },
];

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'valtrox51@gmail.com',
    password: 'ValtroxSystemX1',
    ign: 'Valtrox_Owner',
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
    content: `Welcome to the official Valtrox Competitive Gaming Platform! 
Official 1v1 testing and calibration is open for Bedfight, Skywars, and Mace.

Join our official Discord community to queue with certified evaluators.`,
    summary: 'Testing queues are officially open for Bedfight, Skywars, and Mace on Discord.',
    author: 'Valtrox_Owner',
    authorRole: 'Owner',
    date: '2025-03-01',
    pinned: true,
    views: 120,
    tags: ['Testing', 'Bedfight', 'Skywars', 'Mace']
  }
];

export const INITIAL_SERVER_CONFIG: ServerConfig = {
  testingStatus: 'Open',
  activeSeason: 'Season 1 (Bedrock Competitive)',
  discordUrl: 'https://discord.gg/tV9vrAeJHH',
  discordMembers: 128,
  onlineMembers: 21,
  totalTestsConducted: 0,
  totalRegisteredPlayers: 0,
  scrimsHosted: 0,
  rulesVersion: 'v1.0'
};