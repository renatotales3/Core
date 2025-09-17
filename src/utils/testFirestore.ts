import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { TransactionType } from '../types/financial';

/**
 * Teste de conexão e CRUD básico com Firestore
 */
export const testFirestore = {
  /**
   * Teste básico de escrita no Firestore
   */
  async testWrite(userId: string): Promise<void> {
    try {
      console.log('🧪 Testando escrita no Firestore...');
      
      const testDoc = {
        userId,
        type: TransactionType.INCOME,
        category: 'salary',
        amount: 1000,
        description: 'Teste de transação',
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'transactions'), testDoc);
      console.log('✅ Documento de teste criado com ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('🔴 Erro no teste de escrita:', error);
      throw error;
    }
  },

  /**
   * Teste básico de leitura do Firestore
   */
  async testRead(userId: string): Promise<any[]> {
    try {
      console.log('🧪 Testando leitura do Firestore...');
      
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const docs: any[] = [];
      
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('✅ Documentos encontrados:', docs.length);
      return docs;
    } catch (error) {
      console.error('🔴 Erro no teste de leitura:', error);
      throw error;
    }
  },

  /**
   * Teste completo de Firestore
   */
  async runFullTest(userId: string): Promise<void> {
    try {
      console.log('🧪 Iniciando teste completo do Firestore...');
      
      // Teste de leitura primeiro
      await this.testRead(userId);
      
      // Teste de escrita
      await this.testWrite(userId);
      
      // Teste de leitura novamente
      const docs = await this.testRead(userId);
      
      console.log('✅ Teste completo do Firestore concluído com sucesso!');
      console.log('📊 Total de documentos:', docs.length);
      
    } catch (error) {
      console.error('🔴 Falha no teste do Firestore:', error);
      throw error;
    }
  }
};