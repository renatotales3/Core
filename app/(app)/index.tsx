import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text } from '../../src/components/ui/Text';
import { RevolutHeader } from '../../src/components/common/RevolutHeader';
import { 
  BarChartIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  PlusIcon,
  MinusIcon,
  PieChartIcon,
  WalletIcon
} from '../../src/components/ui/Icons';
import { 
  FinancialSummaryCard, 
  QuickActionButton,
  QuickActionsRow,
  YourAccounts,
  TransactionItem,
  TransactionTimeline,
  ExpensesByCategoryChart
} from '../../src/components/financial';
import { colors, spacing, layout } from '../../src/design-system/tokens';
import { useAuth } from '../../src/context/AuthContext';
import { useTransactions, useFinancialSummary, useExpensesByCategory } from '../../src/hooks/useFinancialData';
import { sampleDataHelper } from '../../src/utils/sampleDataHelper';
import { testFirestore } from '../../src/utils/testFirestore';
import { useResponsive } from '../../src/hooks/useResponsive';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { getResponsiveSpacing, getResponsiveFontSize, isSmall } = useResponsive();
  
  // Responsive values
  const screenPadding = getResponsiveSpacing(24);
  // reduzir espaçamento superior para dispositivos móveis (evita muito espaço acima da header)
  const topPadding = getResponsiveSpacing(16);
  const bottomPadding = getResponsiveSpacing(32);
  const sectionSpacing = getResponsiveSpacing(32);
  const titleFontSize = getResponsiveFontSize(18);
  const cardSpacing = getResponsiveSpacing(8);
  
  // Log de debug
  console.log('🏠 Dashboard: Usuário atual:', user?.uid ? 'Autenticado' : 'Não autenticado');
  console.log('🏠 Dashboard: User object:', user);
  
  // Hooks para dados financeiros
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions(5);
  const { summary, loading: summaryLoading, error: summaryError } = useFinancialSummary();
  const { expensesByCategory, loading: expensesLoading, error: expensesError } = useExpensesByCategory();
  
  // Estado para primeira carga
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Criar dados de exemplo na primeira vez que o usuário acessa
  useEffect(() => {
    const createSampleDataIfNeeded = async () => {
      if (!user?.uid) return;
      
      try {
        // Testar conexão com Firestore primeiro
        console.log('🧪 Testando conexão com Firestore...');
        await testFirestore.runFullTest(user.uid);
        
        // Aguardar os dados carregarem primeiro
        if (transactionsLoading || summaryLoading) return;
        
        // Criar dados de exemplo se necessário
        const created = await sampleDataHelper.createSampleDataIfNeeded(
          user.uid,
          transactions.length > 0
        );
        
        if (created) {
          console.log('✅ Dados de exemplo criados para o dashboard');
        }
        
        setIsFirstLoad(false);
      } catch (error) {
        console.error('🔴 Erro ao verificar/criar dados de exemplo:', error);
        setIsFirstLoad(false);
      }
    };

    // Aguardar um pouco para que os hooks carreguem
    const timer = setTimeout(createSampleDataIfNeeded, 1000);
    return () => clearTimeout(timer);
  }, [user?.uid, transactions.length, transactionsLoading, summaryLoading]);
  // Estados de loading principais
  const isLoading = summaryLoading || expensesLoading || transactionsLoading;
  const hasError = summaryError || expensesError || transactionsError;

  const handleAddIncome = () => {
    console.log('Adicionar receita');
  };

  const handleAddExpense = () => {
    console.log('Adicionar despesa');
  };

  const handleViewReports = () => {
    console.log('Ver relatórios');
  };

  const handleViewAllTransactions = () => {
    console.log('Ver todas as transações');
  };

  // Loading state principal
  if (isLoading && isFirstLoad) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: spacing[6]
        }}>
          <ActivityIndicator size="large" color={colors.text.accent} />
          <Text style={{
            color: colors.text.secondary,
            marginTop: spacing[4],
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Carregando seus dados financeiros...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (hasError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: spacing[6]
        }}>
          <Text style={{
            color: colors.text.primary,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: spacing[2],
            textAlign: 'center'
          }}>
            Erro ao carregar dados
          </Text>
          <Text style={{
            color: colors.text.secondary,
            textAlign: 'center'
          }}>
            {summaryError || expensesError || transactionsError}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: layout.container.maxWidth }}>
        <RevolutHeader 
          userName={user?.displayName || 'Usuário'}
          onSearchPress={() => console.log('Pesquisar')}
          onNotificationPress={() => console.log('Notificações')}
          onSettingsPress={() => console.log('Configurações')}
          onAvatarPress={() => console.log('Perfil')}
        />

        {/* Saldo Principal - Estilo Revolut */}
        <View style={{ 
          alignItems: 'center',
          marginBottom: sectionSpacing,
          paddingVertical: getResponsiveSpacing(8),
          // Garantir que o bloco ocupe espaço flexível e esteja centralizado entre header e cards
          width: '100%',
          justifyContent: 'center',
          minHeight: getResponsiveSpacing(isSmall ? 80 : 140),
        }}>
          <Text style={{
            fontSize: getResponsiveFontSize(40),
            fontWeight: '700',
              color: colors.text.primary,
            textAlign: 'center',
            letterSpacing: -0.8,
          }}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(summary?.totalBalance || 0)}
          </Text>
          
          {/* Indicador de variação */}
          {summary?.balanceChange !== undefined && (
              <Text style={{
                fontSize: getResponsiveFontSize(14),
                color: colors.text.accent, // destaque branco
                textAlign: 'center',
                marginTop: getResponsiveSpacing(4),
                fontWeight: '500',
              }}>
                {summary.balanceChange >= 0 ? '+' : ''}{summary.balanceChange.toFixed(1)}% em relação ao mês anterior
              </Text>
          )}
        </View>

  {/* Cards de Receitas e Despesas */}
  <View style={{ marginBottom: sectionSpacing }}>
          <View style={{
            flexDirection: isSmall ? 'column' : 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ 
              flex: 1, 
              marginRight: isSmall ? 0 : cardSpacing,
              marginBottom: isSmall ? cardSpacing : 0
            }}>
              <FinancialSummaryCard
                title="Receitas"
                amount={summary?.monthlyIncome || 0}
                change={summary?.incomeChange || 0}
                changeType="increase"
                icon={TrendingUpIcon}
                variant="income"
              />
            </View>

            <View style={{ 
              flex: 1, 
              marginLeft: isSmall ? 0 : cardSpacing 
            }}>
              <FinancialSummaryCard
                title="Despesas"
                amount={summary?.monthlyExpense || 0}
                change={summary?.expenseChange || 0}
                changeType="decrease"
                icon={TrendingDownIcon}
                variant="expense"
              />
            </View>
          </View>
        </View>

        {/* Ações Rápidas Circulares */}
        <View style={{ marginBottom: sectionSpacing }}>
          <QuickActionsRow
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
            onTransfer={() => console.log('Transferir')}
            onReports={handleViewReports}
          />
        </View>

        {/* Suas Contas */}
        <YourAccounts 
          onAccountPress={(accountId) => console.log('Conta pressionada:', accountId)}
        />

        {/* Gráfico de Gastos por Categoria */}
        {expensesByCategory.length > 0 && (
          <ExpensesByCategoryChart
            data={expensesByCategory}
            totalExpenses={summary?.monthlyExpense || 0}
          />
        )}

        {/* Transações Recentes - Timeline */}
        <View style={{ marginBottom: getResponsiveSpacing(24) }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: getResponsiveSpacing(8),
            paddingHorizontal: getResponsiveSpacing(24),
          }}>
            <Text style={{
              fontSize: titleFontSize,
              fontWeight: '600',
              color: colors.text.primary,
            }}>
              Transações Recentes
            </Text>

            <Text 
              style={{
                fontSize: getResponsiveFontSize(14),
                color: colors.text.accent,
                fontWeight: '500',
              }}
              onPress={handleViewAllTransactions}
            >
              Ver todas
            </Text>
          </View>

          <TransactionTimeline
            transactions={transactions}
            onTransactionPress={(transaction) => console.log('Transaction pressed:', transaction.id)}
          />
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}