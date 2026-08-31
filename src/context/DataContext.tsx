import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Player,
  TestResult,
  Tester,
  StaffMember,
  Announcement,
  ServerConfig,
  Gamemode,
  TierRank,
  UserAccount,
  UserRank,
  LiveDMNews
} from '../types';
import {
  INITIAL_PLAYERS,
  INITIAL_TEST_RESULTS,
  INITIAL_TESTERS,
  INITIAL_STAFF,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SERVER_CONFIG,
  INITIAL_ACCOUNTS
} from '../data/initialData';

interface DataContextType {
  players: Player[];
  testResults: TestResult[];
  testers: Tester[];
  staff: StaffMember[];
  announcements: Announcement[];
  serverConfig: ServerConfig;
  activeTab: string;
  selectedPlayerId: string | null;
  selectedGamemode: Gamemode;
  searchOpen: boolean;
  
  // Auth state & methods
  accounts: UserAccount[];
  currentUser: UserAccount | null;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  setAuthModalOpen: (open: boolean, mode?: 'login' | 'signup') => void;
  login: (email: string, pass: string) => { success: boolean; message: string };
  signup: (email: string, pass: string, ign: string, discordTag: string) => { success: boolean; message: string };
  logout: () => void;
  assignRankByEmail: (email: string, rank: UserRank) => { success: boolean; message: string };

  // Live DM Notification state & methods
  activeLiveDM: LiveDMNews | null;
  sendLiveDM: (message: string) => void;
  dismissLiveDM: () => void;

  // Navigation
  navigateTo: (tab: string, playerId?: string) => void;
  setSelectedGamemode: (gm: Gamemode) => void;
  setSearchOpen: (open: boolean) => void;

  // Player Actions
  addPlayer: (player: Omit<Player, 'id' | 'globalRank'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  updatePlayerTier: (playerId: string, gamemode: Gamemode, newTier: TierRank, testerName: string, score: string, notes?: string) => void;

  // Test Results Actions
  addTestResult: (result: Omit<TestResult, 'id'>) => void;
  deleteTestResult: (id: string) => void;

  // Tester Actions
  addTester: (tester: Omit<Tester, 'id'>) => void;
  updateTester: (tester: Tester) => void;
  deleteTester: (id: string) => void;

  // Staff Actions
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (member: StaffMember) => void;
  deleteStaff: (id: string) => void;

  // Announcement Actions
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;

  // Server Config Actions
  updateServerConfig: (config: Partial<ServerConfig>) => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'valtrox_db_v7_ranks_auth_clean';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : null;
  });

  const [authModalOpen, setAuthModalOpenState] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return !saved; // Automatically ask for signup or login on first visit!
  });
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  const setAuthModalOpen = (open: boolean, mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpenState(open);
  };

  const [activeLiveDM, setActiveLiveDM] = useState<LiveDMNews | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activeLiveDM`);
    if (saved) {
      const dm = JSON.parse(saved);
      if (Date.now() - dm.timestamp < 10000) {
        return dm;
      }
    }
    return null;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_testResults`);
    return saved ? JSON.parse(saved) : INITIAL_TEST_RESULTS;
  });

  const [testers, setTesters] = useState<Tester[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_testers`);
    return saved ? JSON.parse(saved) : INITIAL_TESTERS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_serverConfig`);
    return saved ? { ...INITIAL_SERVER_CONFIG, ...JSON.parse(saved), discordUrl: 'https://discord.gg/tV9vrAeJHH' } : INITIAL_SERVER_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedGamemode, setSelectedGamemode] = useState<Gamemode>('Bedfight');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Auto-fetch live Discord stats from official invite API
  useEffect(() => {
    const fetchDiscordStats = async () => {
      try {
        const res = await fetch('https://discord.com/api/v9/invites/tV9vrAeJHH?with_counts=true');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.approximate_member_count === 'number') {
            setServerConfig((prev) => ({
              ...prev,
              discordMembers: data.approximate_member_count,
              onlineMembers: data.approximate_presence_count || prev.onlineMembers,
            }));
          }
        }
      } catch (err) {
        console.warn('Discord API live count check bypassed (offline/CORS):', err);
      }
    };

    fetchDiscordStats();
    const interval = setInterval(fetchDiscordStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeLiveDM) {
      localStorage.setItem(`${STORAGE_KEY}_activeLiveDM`, JSON.stringify(activeLiveDM));
      const timer = setTimeout(() => {
        setActiveLiveDM(null);
        localStorage.removeItem(`${STORAGE_KEY}_activeLiveDM`);
      }, 10000); // 10 seconds auto-dismiss
      return () => clearTimeout(timer);
    }
  }, [activeLiveDM]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_testResults`, JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_testers`, JSON.stringify(testers));
  }, [testers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_serverConfig`, JSON.stringify(serverConfig));
  }, [serverConfig]);

  // Auth Methods
  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isMasterAdmin = trimmedEmail === 'valtrox51@gmail.com';

    let account = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

    if (!account && isMasterAdmin && pass === 'ValtroxSystemX1') {
      const adminAcc: UserAccount = {
        id: 'acc-owner-master',
        email: 'valtrox51@gmail.com',
        password: 'ValtroxSystemX1',
        ign: 'Valtrox_Owner',
        discordTag: 'valtrox_owner',
        rank: 'Owner',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAccounts((prev) => [...prev, adminAcc]);
      setCurrentUser(adminAcc);

      // Auto-sync into Players roster
      setPlayers((prev) => {
        if (!prev.some((p) => p.email?.toLowerCase() === 'valtrox51@gmail.com' || p.ign.toLowerCase() === 'valtrox_owner')) {
          const ownerPlayer: Player = {
            id: 'ply-valtrox-owner',
            ign: 'Valtrox_Owner',
            discordTag: 'valtrox_owner',
            email: 'valtrox51@gmail.com',
            rank: 'Owner',
            points: 2500,
            region: 'NA',
            device: 'KBM',
            joinDate: new Date().toISOString().split('T')[0],
            bio: 'Valtrox Platform Owner & System Administrator.',
            verified: true,
            status: 'Active',
            tiers: {
              Bedfight: 'HT1',
              Skywars: 'HT1',
              Mace: 'HT1'
            },
            tierHistory: [],
            matchesPlayed: 0,
            winRate: 100,
            scrimWins: 0,
            tourneyTrophies: 0,
            globalRank: 1
          };
          return [ownerPlayer, ...prev];
        }
        return prev;
      });

      setAuthModalOpenState(false);
      return { success: true, message: '👑 Welcome Master Admin! Full Admin Panel access granted.' };
    }

    if (!account) {
      return { success: false, message: 'No account found with this email. Please Sign Up.' };
    }
    if (account.password !== pass) {
      return { success: false, message: 'Incorrect password.' };
    }

    if (isMasterAdmin && account.rank !== 'Owner') {
      account = { ...account, rank: 'Owner' };
      setAccounts((prev) => prev.map((a) => (a.email.toLowerCase() === trimmedEmail ? account! : a)));
    }

    setCurrentUser(account);

    // Ensure player is in Players roster
    setPlayers((prev) => {
      const idx = prev.findIndex((p) => p.email?.toLowerCase() === trimmedEmail || p.ign.toLowerCase() === account!.ign.toLowerCase());
      if (idx === -1) {
        const newPlayer: Player = {
          id: `ply-${Date.now()}`,
          ign: account!.ign,
          discordTag: account!.discordTag,
          email: account!.email,
          rank: account!.rank,
          points: 1000,
          region: 'NA',
          device: 'KBM',
          joinDate: account!.createdAt || new Date().toISOString().split('T')[0],
          bio: 'Competitive Minecraft Bedrock player on Valtrox.',
          verified: true,
          status: 'Active',
          tiers: {
            Bedfight: isMasterAdmin ? 'HT1' : 'Untested',
            Skywars: isMasterAdmin ? 'HT1' : 'Untested',
            Mace: isMasterAdmin ? 'HT1' : 'Untested'
          },
          tierHistory: [],
          matchesPlayed: 0,
          winRate: 0,
          scrimWins: 0,
          tourneyTrophies: 0,
          globalRank: prev.length + 1
        };
        return [...prev, newPlayer];
      }
      return prev;
    });

    setAuthModalOpenState(false);
    return {
      success: true,
      message: isMasterAdmin
        ? '👑 Master Admin authenticated! Full Admin Panel access granted.'
        : `Welcome back, ${account.ign}!`
    };
  };

  const signup = (email: string, pass: string, ign: string, discordTag: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanIgn = ign.trim();
    const cleanDiscord = discordTag.trim() || cleanIgn;

    if (!trimmedEmail || !pass || !cleanIgn) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const isMasterAdmin = trimmedEmail === 'valtrox51@gmail.com';
    const assignedRank: UserRank = isMasterAdmin ? 'Owner' : 'Player';

    const existingIndex = accounts.findIndex((a) => a.email.toLowerCase() === trimmedEmail);
    if (existingIndex !== -1) {
      if (isMasterAdmin) {
        const updatedAccounts = [...accounts];
        updatedAccounts[existingIndex] = {
          ...updatedAccounts[existingIndex],
          password: pass,
          ign: cleanIgn || updatedAccounts[existingIndex].ign,
          discordTag: cleanDiscord || updatedAccounts[existingIndex].discordTag,
          rank: 'Owner'
        };
        setAccounts(updatedAccounts);
        setCurrentUser(updatedAccounts[existingIndex]);

        // Sync to players roster
        setPlayers((prev) => {
          const pIdx = prev.findIndex((p) => p.email?.toLowerCase() === trimmedEmail || p.ign.toLowerCase() === cleanIgn.toLowerCase());
          if (pIdx !== -1) {
            const updated = [...prev];
            updated[pIdx] = { ...updated[pIdx], rank: 'Owner', ign: cleanIgn, email: trimmedEmail };
            return updated;
          }
          const ownerPlayer: Player = {
            id: 'ply-valtrox-owner',
            ign: cleanIgn,
            discordTag: cleanDiscord,
            email: trimmedEmail,
            rank: 'Owner',
            points: 2500,
            region: 'NA',
            device: 'KBM',
            joinDate: new Date().toISOString().split('T')[0],
            bio: 'Valtrox Platform Owner & System Administrator.',
            verified: true,
            status: 'Active',
            tiers: {
              Bedfight: 'HT1',
              Skywars: 'HT1',
              Mace: 'HT1'
            },
            tierHistory: [],
            matchesPlayed: 0,
            winRate: 100,
            scrimWins: 0,
            tourneyTrophies: 0,
            globalRank: 1
          };
          return [ownerPlayer, ...prev];
        });

        setAuthModalOpenState(false);
        return { success: true, message: '👑 Master Admin authenticated with Owner & Admin Panel access!' };
      }
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      password: pass,
      ign: cleanIgn,
      discordTag: cleanDiscord,
      rank: assignedRank,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts((prev) => [...prev, newAccount]);
    setCurrentUser(newAccount);

    // AUTOMATICALLY REGISTER INTO PLAYERS ROSTER
    setPlayers((prev) => {
      const existingPlayerIndex = prev.findIndex(
        (p) => p.email?.toLowerCase() === trimmedEmail || p.ign.toLowerCase() === cleanIgn.toLowerCase()
      );
      if (existingPlayerIndex !== -1) {
        const updated = [...prev];
        updated[existingPlayerIndex] = {
          ...updated[existingPlayerIndex],
          rank: assignedRank,
          discordTag: cleanDiscord,
          email: trimmedEmail
        };
        return updated;
      }

      const newPlayer: Player = {
        id: `ply-${Date.now()}`,
        ign: cleanIgn,
        discordTag: cleanDiscord,
        email: trimmedEmail,
        points: isMasterAdmin ? 2500 : 1000,
        region: 'NA',
        device: 'KBM',
        joinDate: new Date().toISOString().split('T')[0],
        bio: isMasterAdmin ? 'Valtrox Platform Owner & Master Administrator.' : 'Competitive Minecraft Bedrock player on Valtrox.',
        verified: true,
        status: 'Active',
        rank: assignedRank,
        tiers: {
          Bedfight: isMasterAdmin ? 'HT1' : 'Untested',
          Skywars: isMasterAdmin ? 'HT1' : 'Untested',
          Mace: isMasterAdmin ? 'HT1' : 'Untested'
        },
        tierHistory: [],
        matchesPlayed: 0,
        winRate: 0,
        scrimWins: 0,
        tourneyTrophies: 0,
        globalRank: prev.length + 1
      };
      return isMasterAdmin ? [newPlayer, ...prev] : [...prev, newPlayer];
    });

    setAuthModalOpenState(false);
    return {
      success: true,
      message: isMasterAdmin
        ? '👑 Master Admin registered! Full Admin Panel access unlocked!'
        : 'Account successfully registered and added to the Players Roster! Welcome to Valtrox.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Live DM Methods
  const sendLiveDM = (message: string) => {
    if (!message.trim()) return;
    const dm: LiveDMNews = {
      id: `dm-${Date.now()}`,
      message: message.trim(),
      sender: currentUser ? currentUser.ign : 'Valtrox System',
      senderRank: currentUser ? currentUser.rank : 'Owner',
      timestamp: Date.now()
    };
    setActiveLiveDM(dm);
  };

  const dismissLiveDM = () => {
    setActiveLiveDM(null);
    localStorage.removeItem(`${STORAGE_KEY}_activeLiveDM`);
  };

  // Rank Assignment
  const assignRankByEmail = (email: string, rank: UserRank) => {
    const targetEmail = email.trim().toLowerCase();
    const accountIndex = accounts.findIndex((a) => a.email.toLowerCase() === targetEmail);
    if (accountIndex === -1) {
      return { success: false, message: `No user found with email "${email}".` };
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      rank
    };
    setAccounts(updatedAccounts);

    if (currentUser && currentUser.email.toLowerCase() === targetEmail) {
      setCurrentUser({ ...currentUser, rank });
    }

    // Also update players registry if matching email or IGN
    setPlayers((prev) =>
      prev.map((p) =>
        p.email?.toLowerCase() === targetEmail || p.ign.toLowerCase() === updatedAccounts[accountIndex].ign.toLowerCase()
          ? { ...p, rank }
          : p
      )
    );

    return {
      success: true,
      message: `Successfully assigned rank [${rank}] to ${updatedAccounts[accountIndex].ign} (${email})!`
    };
  };

  // Navigation
  const navigateTo = (tab: string, playerId?: string) => {
    setActiveTab(tab);
    if (playerId) {
      setSelectedPlayerId(playerId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Player Actions
  const addPlayer = (newPlayerData: Omit<Player, 'id' | 'globalRank'>) => {
    const id = `p-${Date.now()}`;
    const newPlayer: Player = {
      ...newPlayerData,
      id,
      globalRank: players.length + 1,
    };
    setPlayers((prev) => [newPlayer, ...prev]);
    setServerConfig((prev) => ({
      ...prev,
      totalRegisteredPlayers: prev.totalRegisteredPlayers + 1,
    }));
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)));
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePlayerTier = (
    playerId: string,
    gamemode: Gamemode,
    newTier: TierRank,
    testerName: string,
    score: string,
    notes?: string
  ) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id !== playerId) return player;
        const previousTier = player.tiers[gamemode] || 'Untested';
        const newHistoryEntry = {
          id: `th-${Date.now()}`,
          gamemode,
          previousTier,
          newTier,
          score,
          tester: testerName,
          date: new Date().toISOString().split('T')[0],
          notes,
        };
        return {
          ...player,
          tiers: {
            ...player.tiers,
            [gamemode]: newTier,
          },
          tierHistory: [newHistoryEntry, ...player.tierHistory],
        };
      })
    );
  };

  // Test Results Actions
  const addTestResult = (newResultData: Omit<TestResult, 'id'>) => {
    const id = `tr-${Date.now()}`;
    const newResult: TestResult = {
      ...newResultData,
      id,
    };
    setTestResults((prev) => [newResult, ...prev]);
    setServerConfig((prev) => ({
      ...prev,
      totalTestsConducted: prev.totalTestsConducted + 1,
    }));
  };

  const deleteTestResult = (id: string) => {
    setTestResults((prev) => prev.filter((tr) => tr.id !== id));
  };

  // Tester Actions
  const addTester = (newTesterData: Omit<Tester, 'id'>) => {
    const id = `t-${Date.now()}`;
    const newTester: Tester = { ...newTesterData, id };
    setTesters((prev) => [...prev, newTester]);
  };

  const updateTester = (updatedTester: Tester) => {
    setTesters((prev) => prev.map((t) => (t.id === updatedTester.id ? updatedTester : t)));
  };

  const deleteTester = (id: string) => {
    setTesters((prev) => prev.filter((t) => t.id !== id));
  };

  // Staff Actions
  const addStaff = (newStaffData: Omit<StaffMember, 'id'>) => {
    const id = `s-${Date.now()}`;
    const newStaff: StaffMember = { ...newStaffData, id };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaff = (updatedStaff: StaffMember) => {
    setStaff((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // Announcement Actions
  const addAnnouncement = (newAnnData: Omit<Announcement, 'id'>) => {
    const id = `a-${Date.now()}`;
    const newAnn: Announcement = { ...newAnnData, id };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const updateAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === updatedAnn.id ? updatedAnn : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Server Config Actions
  const updateServerConfig = (config: Partial<ServerConfig>) => {
    setServerConfig((prev) => ({ ...prev, ...config }));
  };

  const resetToDefaults = () => {
    setPlayers(INITIAL_PLAYERS);
    setTestResults(INITIAL_TEST_RESULTS);
    setTesters(INITIAL_TESTERS);
    setStaff(INITIAL_STAFF);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setServerConfig(INITIAL_SERVER_CONFIG);
    setAccounts(INITIAL_ACCOUNTS);
    localStorage.clear();
  };

  const exportDataJSON = () => {
    return JSON.stringify(
      {
        players,
        testResults,
        testers,
        staff,
        announcements,
        serverConfig,
        accounts
      },
      null,
      2
    );
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.players) setPlayers(data.players);
      if (data.testResults) setTestResults(data.testResults);
      if (data.testers) setTesters(data.testers);
      if (data.staff) setStaff(data.staff);
      if (data.announcements) setAnnouncements(data.announcements);
      if (data.serverConfig) setServerConfig(data.serverConfig);
      if (data.accounts) setAccounts(data.accounts);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        players,
        testResults,
        testers,
        staff,
        announcements,
        serverConfig,
        activeTab,
        selectedPlayerId,
        selectedGamemode,
        searchOpen,
        accounts,
        currentUser,
        authModalOpen,
        authModalMode,
        setAuthModalOpen,
        login,
        signup,
        logout,
        assignRankByEmail,
        activeLiveDM,
        sendLiveDM,
        dismissLiveDM,
        navigateTo,
        setSelectedGamemode,
        setSearchOpen,
        addPlayer,
        updatePlayer,
        deletePlayer,
        updatePlayerTier,
        addTestResult,
        deleteTestResult,
        addTester,
        updateTester,
        deleteTester,
        addStaff,
        updateStaff,
        deleteStaff,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        updateServerConfig,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
