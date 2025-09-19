// Interface para dados do usuário no app
export interface AppUser {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Dados específicos do app financeiro
  profile?: UserProfile;
}

// Perfil financeiro do usuário
export interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate?: Date;
  phone?: string;
  // Configurações financeiras
  currency: string; // 'BRL', 'USD', etc.
  monthlyIncome?: number;
  financialGoals?: FinancialGoal[];
  // Preferências do app
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
}

// Meta financeira
export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: 'emergency' | 'investment' | 'purchase' | 'travel' | 'other';
  isActive: boolean;
  createdAt: Date;
}

// Configurações de notificação
export interface NotificationSettings {
  dailyReminder: boolean;
  weeklyReport: boolean;
  goalMilestones: boolean;
  expenseAlerts: boolean;
  investmentUpdates: boolean;
}

// Estado de autenticação
export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// Dados para registro
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Dados para login
export interface LoginData {
  email: string;
  password: string;
}

// Resposta de autenticação
export interface AuthResponse {
  success: boolean;
  user?: AppUser;
  error?: string;
  redirecting?: boolean;
}