export type Gamemode = 'Bedfight' | 'Skywars' | 'Mace' | 'Fireball Fight';

export type TierRank =
  | 'HT1' | 'MT1' | 'LT1'
  | 'HT2' | 'MT2' | 'LT2'
  | 'HT3' | 'MT3' | 'LT3'
  | 'HT4' | 'MT4' | 'LT4'
  | 'HT5' | 'MT5' | 'LT5'
  | 'Unranked'
  | 'Untested';

export type UserRank =
  | 'Owner'
  | 'Developer'
  | 'Administrator'
  | 'Moderator'
  | 'Bedrock Union Partner'
  | 'VIP'
  | 'Tier Tester'
  | 'Content Creator+'
  | 'Content Creator'
  | 'MVP++'
  | 'MVP+'
  | 'MVP'
  | 'Player';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  ign: string;
  discordTag: string;
  rank: UserRank;
  avatarBg?: string;
  createdAt: string;
}

export interface LiveDMNews {
  id: string;
  message: string;
  sender: string;
  senderRank: UserRank;
  timestamp: number;
}

export interface TierHistoryEntry {
  id: string;
  gamemode: Gamemode;
  previousTier: TierRank;
  newTier: TierRank;
  score: string;
  tester: string;
  date: string;
  notes?: string;
}

export interface Player {
  id: string;
  ign: string;
  discordTag: string;
  email?: string;
  avatarUrl?: string;
  rank?: UserRank;
  globalRank: number;
  points: number;
  region: 'NA' | 'EU' | 'AS' | 'SA' | 'OC';
  device: 'Touch' | 'KBM' | 'Controller';
  joinDate: string;
  bio: string;
  verified: boolean;
  status: 'Active' | 'Inactive' | 'Banned';
  tiers: Record<Gamemode, TierRank>;
  tierHistory: TierHistoryEntry[];
  matchesPlayed: number;
  winRate: number;
  scrimWins: number;
  tourneyTrophies: number;
}

export interface TestResult {
  id: string;
  playerId: string;
  playerIgn: string;
  playerDiscord: string;
  gamemode: Gamemode;
  previousTier: TierRank;
  newTier: TierRank;
  score: string;
  testerId: string;
  testerName: string;
  notes: string;
  date: string;
  verified: boolean;
}

export interface Tester {
  id: string;
  name: string;
  discordTag: string;
  role: 'Head Tester' | 'Senior Tester' | 'Gamemode Tester' | 'Trial Tester';
  avatarUrl?: string;
  gamemodes: Gamemode[];
  testsConducted: number;
  status: 'Active' | 'Busy' | 'On Break';
  joinDate: string;
  verifiedPassRate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRank;
  discordTag: string;
  avatarUrl?: string;
  bio: string;
  badgeColor: string;
  joinedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Update' | 'Tournament' | 'Testing Openings' | 'Rule Changes' | 'General';
  content: string;
  summary: string;
  author: string;
  authorRole: string;
  date: string;
  pinned: boolean;
  views: number;
  tags: string[];
}

export interface ServerConfig {
  serverName: string;
  testingStatus: 'Open' | 'Closed' | 'Priority Only';
  activeSeason: string;
  discordUrl: string;
  discordMembers: number;
  onlineMembers: number;
  totalTestsConducted: number;
  totalRegisteredPlayers: number;
  scrimsHosted: number;
  rulesVersion: string;
}