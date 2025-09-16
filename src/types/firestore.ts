// Tipos para as coleções do Firestore
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  account?: string;
  tags?: string[];
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // a cada X dias/semanas/meses/anos
    endDate?: Date;
  };
  attachments?: string[]; // URLs de imagens/documentos
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: 'stock' | 'bond' | 'fund' | 'crypto' | 'real_estate' | 'other';
  symbol?: string; // Ticker do ativo
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  totalInvested: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  broker?: string;
  notes?: string;
  purchaseDate: Date;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  parentId?: string; // Para subcategorias
  isDefault: boolean; // Categorias padrão do sistema
  budgetLimit?: number; // Limite de orçamento mensal
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  categories: {
    categoryId: string;
    allocatedAmount: number;
    spentAmount: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'cash' | 'other';
  balance: number;
  currency: string;
  bank?: string;
  isActive: boolean;
  color: string;
  icon: string;
  includeInNetWorth: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: 'emergency' | 'investment' | 'purchase' | 'travel' | 'debt_payoff' | 'other';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  monthlyContribution?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Dados consolidados para dashboards
export interface FinancialSummary {
  userId: string;
  period: string; // YYYY-MM
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalInvestments: number;
  netWorth: number;
  expensesByCategory: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
  savingsRate: number;
  budgetUsage: number; // Percentual do orçamento usado
  goalProgress: {
    goalId: string;
    progress: number; // Percentual de progresso
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Collections do Firestore
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  INVESTMENTS: 'investments',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
  ACCOUNTS: 'accounts',
  FINANCIAL_GOALS: 'financial_goals',
  FINANCIAL_SUMMARIES: 'financial_summaries',
} as const;