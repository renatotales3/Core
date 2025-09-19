import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, TransactionType, CreateTransactionData } from '../types/financial';

// Interface local para atualização
interface UpdateTransactionData {
  type?: TransactionType;
  category?: string;
  amount?: number;
  description?: string;
  date?: Date | string;
}

/**
 * Serviço para gerenciar transações financeiras no Firestore
 */
class TransactionService {
  private collectionName = 'transactions';

  /**
   * Criar uma nova transação
   */
  async createTransaction(userId: string, data: CreateTransactionData): Promise<string> {
    try {
      const transactionData = {
        userId,
        type: data.type,
        category: data.category,
        amount: data.amount,
        description: data.description || '',
        date: data.date ? 
          (data.date instanceof Date ? Timestamp.fromDate(data.date) : Timestamp.fromDate(new Date(data.date))) 
          : Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), transactionData);
      console.log('✅ Transação criada com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('🔴 Erro ao criar transação:', error);
      throw new Error('Erro ao criar transação. Tente novamente.');
    }
  }

  /**
   * Atualizar uma transação existente
   */
 
  async updateTransaction(id: string, data: UpdateTransactionData): Promise<void> {
    try {
      const transactionRef = doc(db, this.collectionName, id);
      
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      // Adicionar apenas campos que foram fornecidos
      if (data.type !== undefined) updateData.type = data.type;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.date !== undefined) {
        updateData.date = data.date instanceof Date ? 
          Timestamp.fromDate(data.date) : 
          Timestamp.fromDate(new Date(data.date));
      }

      await updateDoc(transactionRef, updateData);
      console.log('✅ Transação atualizada com sucesso:', id);
    } catch (error) {
      console.error('🔴 Erro ao atualizar transação:', error);
      throw new Error('Erro ao atualizar transação. Tente novamente.');
    }
  }

  /**
   * Deletar uma transação
   */
  async deleteTransaction(id: string): Promise<void> {
    try {
      const transactionRef = doc(db, this.collectionName, id);
      await deleteDoc(transactionRef);
      console.log('✅ Transação deletada com sucesso:', id);
    } catch (error) {
      console.error('🔴 Erro ao deletar transação:', error);
      throw new Error('Erro ao deletar transação. Tente novamente.');
    }
  }

  /**
   * Buscar uma transação pelo ID
   */
  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const transactionRef = doc(db, this.collectionName, id);
      const transactionSnap = await getDoc(transactionRef);

      if (!transactionSnap.exists()) {
        console.warn('🔴 Transação não encontrada:', id);
        return null;
      }

      const data = transactionSnap.data();
      
      const transaction: Transaction = {
        id: transactionSnap.id,
        userId: data.userId,
        type: data.type as TransactionType,
        category: data.category,
        amount: data.amount,
        description: data.description || '',
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };

      return transaction;
    } catch (error) {
      console.error('🔴 Erro ao buscar transação:', error);
      throw new Error('Erro ao buscar transação. Tente novamente.');
    }
  }

  /**
   * Criar transação de receita
   */
  async createIncome(
    userId: string,
    category: string,
    amount: number,
    description?: string,
    date?: Date
  ): Promise<string> {
    return this.createTransaction(userId, {
      type: TransactionType.INCOME,
      category,
      amount,
      description: description || '',
      date: date || new Date(),
    });
  }

  /**
   * Criar transação de despesa
   */
  async createExpense(
    userId: string,
    category: string,
    amount: number,
    description?: string,
    date?: Date
  ): Promise<string> {
    return this.createTransaction(userId, {
      type: TransactionType.EXPENSE,
      category,
      amount,
      description: description || '',
      date: date || new Date(),
    });
  }

  /**
   * Criar transações de exemplo para demonstração
   */
  async createSampleData(userId: string): Promise<void> {
    try {
      console.log('🔧 Criando dados de exemplo para usuário:', userId);
      
      // Receitas de exemplo
      const incomes = [
        { category: 'salary', amount: 5000, description: 'Salário Mensal', daysAgo: 5 },
        { category: 'freelance', amount: 1200, description: 'Projeto Freelance', daysAgo: 12 },
        { category: 'other_income', amount: 300, description: 'Venda de item', daysAgo: 20 },
      ];

      // Despesas de exemplo
      const expenses = [
        { category: 'food', amount: 89.50, description: 'Almoço - Restaurante', daysAgo: 1 },
        { category: 'transport', amount: 45.00, description: 'Uber para o trabalho', daysAgo: 2 },
        { category: 'food', amount: 156.30, description: 'Supermercado', daysAgo: 3 },
        { category: 'entertainment', amount: 89.00, description: 'Cinema', daysAgo: 5 },
        { category: 'bills', amount: 230.00, description: 'Conta de luz', daysAgo: 7 },
        { category: 'health', amount: 120.00, description: 'Consulta médica', daysAgo: 10 },
        { category: 'shopping', amount: 89.90, description: 'Roupas', daysAgo: 15 },
        { category: 'transport', amount: 80.00, description: 'Combustível', daysAgo: 18 },
      ];

      // Criar receitas
      for (const income of incomes) {
        const date = new Date();
        date.setDate(date.getDate() - income.daysAgo);
        
        await this.createIncome(
          userId,
          income.category,
          income.amount,
          income.description,
          date
        );
      }

      // Criar despesas
      for (const expense of expenses) {
        const date = new Date();
        date.setDate(date.getDate() - expense.daysAgo);
        
        await this.createExpense(
          userId,
          expense.category,
          expense.amount,
          expense.description,
          date
        );
      }

      console.log('✅ Dados de exemplo criados com sucesso');
    } catch (error) {
      console.error('🔴 Erro ao criar dados de exemplo:', error);
      throw new Error('Erro ao criar dados de exemplo');
    }
  }
}

// Exportar instância única do serviço
export const transactionService = new TransactionService();
export default transactionService;