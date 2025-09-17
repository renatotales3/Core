import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Unsubscribe, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Transaction, TransactionType, FinancialSummary } from '../types/financial';

// Hook para transações
export function useTransactions(limitCount: number = 50) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      console.log('📊 useTransactions: Usuário não autenticado');
      return;
    }

    console.log('📊 useTransactions: Iniciando busca para usuário:', user.uid);
    setLoading(true);
    setError(null);

    // Query para buscar transações do usuário (sem orderBy por enquanto para evitar erro de índice)
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      limit(limitCount)
    );

    // Listener em tempo real
    const unsubscribe: Unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        try {
          console.log('📊 useTransactions: Snapshot recebido, documentos:', snapshot.size);
          const transactionsList: Transaction[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Converter timestamp para Date
            const transaction: Transaction = {
              id: doc.id,
              userId: data.userId,
              type: data.type as TransactionType,
              category: data.category,
              amount: data.amount,
              description: data.description,
              date: data.date?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
            
            transactionsList.push(transaction);
          });

          setTransactions(transactionsList);
          setLoading(false);
          console.log('✅ useTransactions: Dados carregados com sucesso, transações:', transactionsList.length);
        } catch (err) {
          console.error('🔴 Erro ao processar transações:', err);
          setError('Erro ao carregar transações');
          setLoading(false);
        }
      },
      (err) => {
        console.error('🔴 Erro no listener de transações:', err);
        console.error('🔴 Código do erro:', err.code);
        console.error('🔴 Mensagem do erro:', err.message);
        
        // Mapear erros específicos do Firebase
        let errorMessage = 'Erro ao conectar com o banco de dados';
        if (err.code === 'permission-denied') {
          errorMessage = 'Permissão negada para acessar os dados';
        } else if (err.code === 'unavailable') {
          errorMessage = 'Serviço temporariamente indisponível';
        } else if (err.code === 'unauthenticated') {
          errorMessage = 'Usuário não autenticado';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [user?.uid, limitCount]);

  return { transactions, loading, error };
}

// Hook para resumo financeiro
export function useFinancialSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setSummary(null);
      setLoading(false);
      setError(null);
      console.log('📊 useFinancialSummary: Usuário não autenticado');
      return;
    }

    console.log('📊 useFinancialSummary: Iniciando cálculo para usuário:', user.uid);
    setLoading(true);
    setError(null);

    // Calcular resumo financeiro baseado nas transações
    const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filtrar transações do mês atual
      const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = (t.date instanceof Timestamp) ? 
          t.date.toDate() : 
          (t.date instanceof Date ? t.date : new Date());
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });

      // Calcular totais
      let totalIncome = 0;
      let totalExpense = 0;

      currentMonthTransactions.forEach(transaction => {
        if (transaction.type === TransactionType.INCOME) {
          totalIncome += transaction.amount;
        } else {
          totalExpense += transaction.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      // Calcular mudanças (simulado - em um app real, compararia com mês anterior)
      const balanceChange = Math.random() * 20 - 10; // -10% a +10%
      const incomeChange = Math.random() * 15; // 0% a +15%
      const expenseChange = Math.random() * 10 - 15; // -15% a -5%

      return {
        totalBalance: balance,
        monthlyIncome: totalIncome,
        monthlyExpense: totalExpense,
        balanceChange,
        incomeChange,
        expenseChange,
      };
    };

    // Query para todas as transações (para calcular resumo) - sem orderBy por enquanto
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        try {
          const transactionsList: Transaction[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            const transaction: Transaction = {
              id: doc.id,
              userId: data.userId,
              type: data.type as TransactionType,
              category: data.category,
              amount: data.amount,
              description: data.description,
              date: data.date?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
            
            transactionsList.push(transaction);
          });

          const calculatedSummary = calculateSummary(transactionsList);
          setSummary(calculatedSummary);
          setLoading(false);
        } catch (err) {
          console.error('Erro ao calcular resumo financeiro:', err);
          setError('Erro ao calcular resumo');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Erro no listener de resumo financeiro:', err);
        setError('Erro ao conectar com o banco de dados');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return { summary, loading, error };
}

// Hook para gastos por categoria
export function useExpensesByCategory() {
  const { user } = useAuth();
  const [expensesByCategory, setExpensesByCategory] = useState<{ category: string; amount: number; color: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setExpensesByCategory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Cores para categorias
    const categoryColors: Record<string, string> = {
      food: '#14b8a6',
      transport: '#22c55e',
      entertainment: '#f59e0b',
      health: '#ef4444',
      education: '#8b5cf6',
      shopping: '#06b6d4',
      bills: '#f97316',
      rent: '#64748b',
      investment: '#10b981',
      other_expense: '#6b7280',
    };

    // Query para despesas do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const expensesQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('type', '==', TransactionType.EXPENSE)
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        try {
          const categoryTotals: Record<string, number> = {};
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            const category = data.category || 'other_expense';
            const amount = data.amount || 0;
            
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          });

          // Converter para array e adicionar cores
          const expensesList = Object.entries(categoryTotals)
            .map(([category, amount]) => ({
              category: getCategoryDisplayName(category),
              amount,
              color: categoryColors[category] || '#6b7280',
            }))
            .sort((a, b) => b.amount - a.amount); // Ordenar por valor decrescente

          setExpensesByCategory(expensesList);
          setLoading(false);
        } catch (err) {
          console.error('Erro ao processar gastos por categoria:', err);
          setError('Erro ao carregar gastos por categoria');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Erro no listener de gastos por categoria:', err);
        setError('Erro ao conectar com o banco de dados');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return { expensesByCategory, loading, error };
}

// Função auxiliar para nomes de categorias
const getCategoryDisplayName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    food: 'Alimentação',
    transport: 'Transporte',
    entertainment: 'Entretenimento',
    health: 'Saúde',
    education: 'Educação',
    shopping: 'Compras',
    bills: 'Contas',
    rent: 'Aluguel',
    investment: 'Investimento',
    salary: 'Salário',
    freelance: 'Freelance',
    business: 'Negócios',
    other_income: 'Outras Receitas',
    other_expense: 'Outros Gastos',
  };
  
  return categoryNames[category] || category;
};