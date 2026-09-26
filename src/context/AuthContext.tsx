import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserNotification, SupportedLanguage } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  notifications: UserNotification[];
  unreadNotificationCount: number;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    phone?: string;
    state?: string;
    password?: string;
    preferredLanguage?: SupportedLanguage;
    role?: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotificationForUser: (
    userId: string,
    notif: Omit<UserNotification, 'id' | 'read' | 'timestamp' | 'userId'>
  ) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_umair_01',
    name: 'Umair Khan',
    email: 'umair.khan@bsai.gov.in',
    phone: '+91 98101 23456',
    state: 'New Delhi',
    role: 'Citizen',
    avatarInitials: 'UK',
    preferredLanguage: 'en',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'usr_rahul_02',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@bsai.gov.in',
    phone: '+91 94520 87654',
    state: 'Uttar Pradesh',
    role: 'Citizen',
    avatarInitials: 'RS',
    preferredLanguage: 'hi',
    createdAt: '2026-02-10T14:20:00Z',
  },
  {
    id: 'usr_priya_03',
    name: 'Priya Verma',
    email: 'priya.verma@bsai.gov.in',
    phone: '+91 98200 45678',
    state: 'Maharashtra',
    role: 'Citizen',
    avatarInitials: 'PV',
    preferredLanguage: 'mr',
    createdAt: '2026-02-18T11:15:00Z',
  },
  {
    id: 'usr_amit_04',
    name: 'Amit Patel',
    email: 'amit.patel@nodal.gov.in',
    phone: '+91 79232 50001',
    state: 'Gujarat',
    role: 'Nodal Officer',
    avatarInitials: 'AP',
    preferredLanguage: 'gu',
    createdAt: '2025-11-05T08:00:00Z',
  },
];

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  // Notifications for Umair Khan
  {
    id: 'notif_u1',
    userId: 'usr_umair_01',
    title: 'DBT Scheme Resolution',
    message: 'Your Aadhaar seed status for PM-Kisan DBT was verified by BSAI AI.',
    type: 'resolution',
    timestamp: '10 min ago',
    read: false,
    ticketId: 'BSAI-2026-1001',
  },
  {
    id: 'notif_u2',
    userId: 'usr_umair_01',
    title: 'PMKVY 4.0 Skill Application',
    message: 'Skill training batch allotment in South Delhi district is in progress.',
    type: 'ticket_update',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif_u3',
    userId: 'usr_umair_01',
    title: 'Digital India Advisory',
    message: 'Citizen service guidance is available in English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and Kannada.',
    type: 'system',
    timestamp: '1 day ago',
    read: true,
  },

  // Notifications for Rahul Sharma
  {
    id: 'notif_r1',
    userId: 'usr_rahul_02',
    title: 'NSP Scholarship 2026-27',
    message: 'Institute level verification completed. Direct Benefit Transfer queued.',
    type: 'resolution',
    timestamp: '5 min ago',
    read: false,
    ticketId: 'BSAI-2026-1002',
  },
  {
    id: 'notif_r2',
    userId: 'usr_rahul_02',
    title: 'KCC Crop Insurance Support',
    message: 'District agriculture officer has requested land record verification.',
    type: 'ticket_update',
    timestamp: '2 hours ago',
    read: false,
  },

  // Notifications for Priya Verma
  {
    id: 'notif_p1',
    userId: 'usr_priya_03',
    title: 'Ayushman Golden Card Generated',
    message: 'Your family e-KYC is complete. Download digital health card from PM-JAY portal.',
    type: 'resolution',
    timestamp: '15 min ago',
    read: false,
    ticketId: 'BSAI-2026-1003',
  },
  {
    id: 'notif_p2',
    userId: 'usr_priya_03',
    title: 'Women Entrepreneurship Grant',
    message: 'Application passed preliminary AI evaluation. Nodal verification pending.',
    type: 'ticket_update',
    timestamp: '3 hours ago',
    read: false,
  },

  // Notifications for Amit Patel (Nodal Officer)
  {
    id: 'notif_a1',
    userId: 'usr_amit_04',
    title: 'Immediate Escalation Required',
    message: 'District grievance #ESC-2026-4412 escalated for urgent nodal intervention.',
    type: 'escalation',
    timestamp: '2 min ago',
    read: false,
  },
  {
    id: 'notif_a2',
    userId: 'usr_amit_04',
    title: 'Daily Telemetry Milestone',
    message: 'The service dashboard is ready to review request status and support activity.',
    type: 'system',
    timestamp: '45 min ago',
    read: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. All Users (Seed + Local Storage)
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('bsai_all_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USERS;
  });

  // 2. Current Authenticated User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bsai_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USERS[0]; // Default demo account
  });

  // 3. Notifications
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    try {
      const saved = localStorage.getItem('bsai_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 4. Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('bsai_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('bsai_auth_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('bsai_all_users', JSON.stringify(allUsers));
    } catch (e) {
      console.error(e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('bsai_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    const user = allUsers.find(
      u => u.email.toLowerCase() === trimmed || u.name.toLowerCase().includes(trimmed)
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      return true;
    }

    // If not found, create quick citizen profile for demo
    const namePart = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Citizen User';
    
    const initials = formattedName
      .split(' ')
      .map(w => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'CU';

    const newUser: User = {
      id: `usr_dyn_${Date.now()}`,
      name: formattedName,
      email: email.trim(),
      role: 'Citizen',
      avatarInitials: initials,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (data: {
    name: string;
    email: string;
    phone?: string;
    state?: string;
    password?: string;
    preferredLanguage?: SupportedLanguage;
    role?: UserRole;
  }): Promise<boolean> => {
    const initials = data.name
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'CU';

    const newUser: User = {
      id: `usr_reg_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '+91 98000 00000',
      state: data.state?.trim() || 'Digital India',
      role: data.role || 'Citizen',
      avatarInitials: initials,
      preferredLanguage: data.preferredLanguage || 'en',
      createdAt: new Date().toISOString(),
    };

    const welcomeNotif: UserNotification = {
      id: `notif_w_${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to Bharat Support AI',
      message: `Namaste ${newUser.name}! Your citizen portal account is active with 24/7 AI multi-lingual assistance.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    };

    setAllUsers(prev => [newUser, ...prev]);
    setNotifications(prev => [welcomeNotif, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bsai_auth_user');
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const userNotifications = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  const unreadNotificationCount = userNotifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const addNotificationForUser = (
    userId: string,
    notif: Omit<UserNotification, 'id' | 'read' | 'timestamp' | 'userId'>
  ) => {
    const newNotif: UserNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      ticketId: notif.ticketId,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        allUsers,
        isAuthModalOpen,
        authModalMode,
        notifications: userNotifications,
        unreadNotificationCount,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        switchUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotificationForUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
