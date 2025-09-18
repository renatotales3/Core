import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, Category } from '../types/firestore';
import { colors } from '../design-system/tokens';

class FirestoreService {
  /**
   * Criar categorias padrão para um novo usuário
   */
  async createDefaultCategories(userId: string): Promise<void> {
    try {
      const defaultCategories: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
        // Categorias de Receita (usar tokens semânticos em vez de hex hard-coded)
        { userId, name: 'Salário', type: 'income', color: colors.primary[500], icon: '💰', isDefault: true },
        { userId, name: 'Freelance', type: 'income', color: colors.secondary[500], icon: '💻', isDefault: true },
        { userId, name: 'Investimentos', type: 'income', color: colors.primary[300], icon: '📈', isDefault: true },
        { userId, name: 'Outros', type: 'income', color: colors.neutral[500], icon: '🎁', isDefault: true },

        // Categorias de Despesas (usar tokens que fazem sentido sem forçar verde como destaque)
        { userId, name: 'Alimentação', type: 'expense', color: colors.error[500], icon: '🍕', isDefault: true },
        { userId, name: 'Transporte', type: 'expense', color: colors.warning[500], icon: '🚗', isDefault: true },
        { userId, name: 'Moradia', type: 'expense', color: colors.secondary[300], icon: '🏠', isDefault: true },
        { userId, name: 'Saúde', type: 'expense', color: colors.success[500], icon: '⚕️', isDefault: true },
        { userId, name: 'Educação', type: 'expense', color: colors.secondary[500], icon: '📚', isDefault: true },
        { userId, name: 'Lazer', type: 'expense', color: colors.warning[500], icon: '🎉', isDefault: true },
        { userId, name: 'Compras', type: 'expense', color: colors.secondary[400], icon: '🛍️', isDefault: true },
        { userId, name: 'Contas', type: 'expense', color: colors.secondary[500], icon: '📄', isDefault: true },
        { userId, name: 'Outros', type: 'expense', color: colors.neutral[500], icon: '📦', isDefault: true },
      ];

      const categoriesCollection = collection(db, COLLECTIONS.CATEGORIES);

      // Criar todas as categorias em paralelo
      const promises = defaultCategories.map(async (category) => {
        return addDoc(categoriesCollection, {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await Promise.all(promises);
      console.log('Categorias padrão criadas com sucesso');
    } catch (error) {
      console.error('Erro ao criar categorias padrão:', error);
      throw error;
    }
  }

  /**
   * Buscar categorias do usuário
   */
  async getUserCategories(userId: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
      const q = query(
        categoriesRef,
        where('userId', '==', userId),
        orderBy('type'),
        orderBy('name')
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
      })) as Category[];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  /**
   * Verificar se o usuário já tem categorias
   */
  async userHasCategories(userId: string): Promise<boolean> {
    try {
      const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
      const q = query(
        categoriesRef,
        where('userId', '==', userId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar categorias:', error);
      return false;
    }
  }

  /**
   * Criar documento com ID automático
   */
  async create<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao criar documento em ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Criar documento com ID específico
   */
  async createWithId<T>(collectionName: string, id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Erro ao criar documento com ID em ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Buscar documento por ID
   */
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          ...(data.createdAt && { createdAt: (data.createdAt as Timestamp).toDate() }),
          ...(data.updatedAt && { updatedAt: (data.updatedAt as Timestamp).toDate() }),
        } as T;
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar documento em ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Atualizar documento
   */
  async update(collectionName: string, id: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Erro ao atualizar documento em ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Deletar documento
   */
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erro ao deletar documento em ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Buscar documentos com query
   */
  async query<T>(
    collectionName: string,
    conditions: {
      field: string;
      operator: any;
      value: any;
    }[],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      // Adicionar condições where
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });

      // Adicionar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      // Adicionar limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ...(data.createdAt && { createdAt: (data.createdAt as Timestamp).toDate() }),
          ...(data.updatedAt && { updatedAt: (data.updatedAt as Timestamp).toDate() }),
        };
      }) as T[];
    } catch (error) {
      console.error(`Erro ao fazer query em ${collectionName}:`, error);
      throw error;
    }
  }
}

export default new FirestoreService();