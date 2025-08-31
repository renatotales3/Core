import React, { useState } from 'react';
import { Home, PlusCircle, BarChart3 } from 'lucide-react';

// Tipos para as abas
type TabType = 'dashboard' | 'transactions' | 'reports';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Home },
    { id: 'transactions' as TabType, label: 'Transações', icon: PlusCircle },
    { id: 'reports' as TabType, label: 'Relatórios', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <div className="neu-card p-6 mb-6">
              <h1 className="text-2xl font-bold text-neu-700 mb-2">
                Bem-vindo ao Core
              </h1>
              <p className="text-neu-600">
                No centro das suas finanças
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="neu-card p-4">
                <h3 className="font-semibold text-neu-700 mb-2">Saldo Total</h3>
                <p className="text-2xl font-bold text-primary-600">R$ 0,00</p>
              </div>
              
              <div className="neu-card p-4">
                <h3 className="font-semibold text-neu-700 mb-2">Este Mês</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-neu-600">Receitas:</span>
                    <span className="text-sm font-medium text-success-600">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neu-600">Despesas:</span>
                    <span className="text-sm font-medium text-danger-600">R$ 0,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'transactions':
        return (
          <div className="p-6">
            <div className="neu-card p-6 mb-6">
              <h2 className="text-xl font-bold text-neu-700 mb-4">
                Transações
              </h2>
              <p className="text-neu-600 mb-4">
                Gerencie suas receitas e despesas
              </p>
              
              {/* Placeholder para o formulário de transação */}
              <div className="neu-card p-4 bg-neu-50">
                <p className="text-center text-neu-500">
                  Formulário de transação será implementado aqui
                </p>
              </div>
            </div>
            
            {/* Placeholder para a lista de transações */}
            <div className="neu-card p-6">
              <h3 className="font-semibold text-neu-700 mb-4">
                Histórico de Transações
              </h3>
              <div className="text-center text-neu-500 py-8">
                <PlusCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma transação registrada ainda</p>
                <p className="text-sm">Adicione sua primeira transação acima</p>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="p-6">
            <div className="neu-card p-6 mb-6">
              <h2 className="text-xl font-bold text-neu-700 mb-4">
                Relatórios
              </h2>
              <p className="text-neu-600 mb-4">
                Analise suas finanças com gráficos e insights
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Placeholder para gráfico de gastos por categoria */}
              <div className="neu-card p-6">
                <h3 className="font-semibold text-neu-700 mb-4">
                  Gastos por Categoria
                </h3>
                <div className="text-center text-neu-500 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico será exibido aqui</p>
                  <p className="text-sm">Adicione transações para ver os dados</p>
                </div>
              </div>
              
              {/* Placeholder para gráfico de fluxo de caixa */}
              <div className="neu-card p-6">
                <h3 className="font-semibold text-neu-700 mb-4">
                  Fluxo de Caixa
                </h3>
                <div className="text-center text-neu-500 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico será exibido aqui</p>
                  <p className="text-sm">Adicione transações para ver os dados</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neu-200 flex flex-col">
      {/* Conteúdo principal */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {renderContent()}
      </main>
      
      {/* Navegação inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neu-100 border-t border-neu-300/50 shadow-neu">
        <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-neu transition-neu
                  ${isActive 
                    ? 'shadow-neu-inset text-primary-600' 
                    : 'shadow-neu-sm text-neu-600 hover:text-primary-500 hover:shadow-neu'
                  }
                `}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;