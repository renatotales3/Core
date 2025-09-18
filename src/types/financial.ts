import { Timestamp } from 'firebase/firestore';

// Enum para tipos de transação
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Enum para categorias de transação
export enum TransactionCategory {
  // Receitas
  SALARY = 'salary',
  FREELANCE = 'freelance',
  BUSINESS = 'business',
  INVESTMENT_RETURN = 'investment_return',
  GIFT = 'gift',
  OTHER_INCOME = 'other_income',
  
  // Despesas
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  BILLS = 'bills',
  RENT = 'rent',
  INVESTMENT = 'investment',
  OTHER_EXPENSE = 'other_expense',
}

// Interface para categoria personalizada
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  userId: string;
  createdAt: Timestamp;
}

// Interface para transação
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory | string; // Pode ser enum ou ID de categoria personalizada
  amount: number;
  description: string;
  date: Timestamp | Date; // Permitir ambos os tipos
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  
  // Campos opcionais
  receipt?: string; // URL da imagem do comprovante
  tags?: string[];
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

// Interface para resumo financeiro
export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  
  // Comparação com mês anterior
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
}

// Interface para meta financeira
export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Timestamp;
  category: TransactionCategory | string;
  isCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Interface para orçamento
export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory | string;
  limitAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Timestamp;
  endDate: Timestamp;
  notifications: {
    at50Percent: boolean;
    at80Percent: boolean;
    atLimit: boolean;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipos para formulários
export interface CreateTransactionData {
  userId?: string;
  type: TransactionType;
  category: TransactionCategory | string;
  amount: number;
  description?: string;
  date?: Date;
  receipt?: string;
  tags?: string[];
}

export interface UpdateTransactionData {
  type?: TransactionType;
  category?: TransactionCategory | string;
  amount?: number;
  description?: string;
  date?: Date;
  receipt?: string;
  tags?: string[];
}

export interface CreateCategoryData {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  targetAmount: number;
  targetDate: Date;
  category: TransactionCategory | string;
}

export interface CreateBudgetData {
  category: TransactionCategory | string;
  limitAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  notifications: {
    at50Percent: boolean;
    at80Percent: boolean;
    atLimit: boolean;
  };
}

// Tipos para hooks e context
export interface FinancialContextData {
  summary: FinancialSummary | null;
  transactions: Transaction[];
  categories: Category[];
  goals: FinancialGoal[];
  budgets: Budget[];
  
  // Loading states
  isLoadingSummary: boolean;
  isLoadingTransactions: boolean;
  isLoadingCategories: boolean;
  
  // Actions
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: string, data: Partial<CreateTransactionData>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  addCategory: (data: CreateCategoryData) => Promise<void>;
  updateCategory: (id: string, data: Partial<CreateCategoryData>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addGoal: (data: CreateGoalData) => Promise<void>;
  updateGoal: (id: string, data: Partial<CreateGoalData>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  addBudget: (data: CreateBudgetData) => Promise<void>;
  updateBudget: (id: string, data: Partial<CreateBudgetData>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Refresh data
  refreshSummary: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

// Tipos para utilidades
export interface PeriodFilter {
  startDate: Date;
  endDate: Date;
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory | string;
  minAmount?: number;
  maxAmount?: number;
  dateRange?: PeriodFilter;
  tags?: string[];
  searchTerm?: string;
}

// Tipos para relatórios
export interface ReportData {
  period: PeriodFilter;
  summary: FinancialSummary;
  transactions: Transaction[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    transactions: Transaction[];
  }[];
  trends: {
    date: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}