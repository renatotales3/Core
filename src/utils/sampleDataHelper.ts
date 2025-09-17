/**
 * Helper para gerenciar criação de dados de exemplo
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionService } from '../services/transactionService';

const SAMPLE_DATA_KEY = 'sample_data_created';

export const sampleDataHelper = {
  /**
   * Verifica se os dados de exemplo já foram criados para o usuário
   */
  async hasSampleDataBeenCreated(userId: string): Promise<boolean> {
    try {
      const key = `${SAMPLE_DATA_KEY}_${userId}`;
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      console.error('Erro ao verificar se dados de exemplo foram criados:', error);
      return false;
    }
  },

  /**
   * Marca que os dados de exemplo foram criados para o usuário
   */
  async markSampleDataAsCreated(userId: string): Promise<void> {
    try {
      const key = `${SAMPLE_DATA_KEY}_${userId}`;
      await AsyncStorage.setItem(key, 'true');
    } catch (error) {
      console.error('Erro ao marcar dados de exemplo como criados:', error);
    }
  },

  /**
   * Cria dados de exemplo se necessário
   */
  async createSampleDataIfNeeded(userId: string, hasExistingTransactions: boolean): Promise<boolean> {
    try {
      // Se já tem transações, não precisa criar dados de exemplo
      if (hasExistingTransactions) {
        return false;
      }

      // Verificar se já foram criados dados de exemplo
      const alreadyCreated = await this.hasSampleDataBeenCreated(userId);
      if (alreadyCreated) {
        return false;
      }

      console.log('🔄 Criando dados de exemplo para novo usuário...');
      
      // Criar dados de exemplo
      await transactionService.createSampleData(userId);
      
      // Marcar como criado
      await this.markSampleDataAsCreated(userId);
      
      console.log('✅ Dados de exemplo criados com sucesso');
      return true;
    } catch (error) {
      console.error('🔴 Erro ao criar dados de exemplo:', error);
      return false;
    }
  },

  /**
   * Remove a marcação de dados de exemplo (para desenvolvimento/testes)
   */
  async resetSampleDataFlag(userId: string): Promise<void> {
    try {
      const key = `${SAMPLE_DATA_KEY}_${userId}`;
      await AsyncStorage.removeItem(key);
      console.log('🔄 Flag de dados de exemplo resetado');
    } catch (error) {
      console.error('Erro ao resetar flag de dados de exemplo:', error);
    }
  }
};