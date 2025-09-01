# 🚀 Core - No centro das suas finanças

> **PWA moderno e intuitivo para gestão financeira pessoal**

[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-blue.svg)](https://developers.google.com/web/fundamentals/design-and-ux/principles)
[![Dark Mode](https://img.shields.io/badge/Dark-Mode-black.svg)](https://material.io/design/color/dark-theme.html)
[![Offline](https://img.shields.io/badge/Offline-Ready-orange.svg)](https://web.dev/offline/)

## 📱 Sobre o Projeto

**Core** é um aplicativo web progressivo (PWA) focado em finanças pessoais, desenvolvido com design mobile-first e funcionalidades offline. O app oferece uma experiência moderna e intuitiva para controle de gastos, acompanhamento de metas e visualização de dados financeiros.

### ✨ Características Principais

- 🎨 **Design Moderno**: Interface escura com paleta de cores vibrantes
- 📱 **Mobile-First**: Otimizado para dispositivos móveis e tablets
- 🔄 **PWA Completo**: Instalável, offline e com service worker
- 📊 **Gráficos Interativos**: Visualizações financeiras responsivas
- 💾 **Dados Locais**: Armazenamento local com IndexedDB/LocalStorage
- 📤 **Exportação**: Backup de dados em formato JSON
- 🎯 **Metas e Orçamentos**: Planejamento financeiro estruturado
- 📂 **Categorização**: Organização inteligente de gastos

## 🎯 Funcionalidades

### Dashboard Principal
- Visão geral de receitas e despesas
- Gráfico de crescimento semanal
- Lista de transações recentes
- Indicadores de performance

### Controle de Gastos
- Categorização automática
- Gráficos de distribuição
- Acompanhamento de orçamentos
- Alertas de limites

### Metas Financeiras
- Definição de objetivos
- Acompanhamento de progresso
- Barras de progresso visuais
- Prazos e lembretes

### Relatórios e Análises
- Gráficos interativos
- Análise de padrões de consumo
- Insights inteligentes
- Exportação de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Service Worker, Manifest.json, Cache API
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Gráficos**: SVG nativo, Canvas API
- **Armazenamento**: LocalStorage, IndexedDB
- **Responsividade**: Mobile-first, Touch-friendly

## 🚀 Instalação e Uso

### Pré-requisitos
- Navegador moderno com suporte a PWA
- Servidor web (para desenvolvimento local)

### Instalação Local

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/core-finance.git
cd core-finance
```

2. **Inicie um servidor local**
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8000
```

3. **Acesse no navegador**
```
http://localhost:8000
```

### Instalação como PWA

1. Acesse o app no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou use o menu do navegador: "Adicionar à tela inicial"
4. O app será instalado como um aplicativo nativo

## 📁 Estrutura do Projeto

```
core-finance/
├── index.html              # Página principal
├── manifest.json           # Configuração PWA
├── sw.js                  # Service Worker
├── css/                   # Estilos CSS
│   ├── variables.css      # Variáveis e design system
│   ├── reset.css          # CSS reset
│   ├── base.css           # Estilos base
│   ├── components.css     # Componentes
│   ├── layout.css         # Layout e navegação
│   └── pages.css          # Estilos específicos das páginas
├── js/                    # JavaScript
│   ├── app.js            # Aplicação principal
│   ├── navigation.js     # Sistema de navegação
│   └── charts.js         # Gráficos e visualizações
├── assets/                # Recursos estáticos
│   ├── icons/            # Ícones PWA
│   └── avatars/          # Avatares de usuários
└── README.md              # Documentação
```

## 🎨 Design System

### Paleta de Cores
- **Fundo**: `#1A1A1A` (Dark Mode)
- **Superfície**: `#2A2A2A` (Cards e elementos)
- **Primária**: `#6EE7B7` (Verde-água para ganhos)
- **Secundária**: `#FBCFE8` (Rosa para acentos)
- **Acento**: `#FDE68A` (Amarelo para destaques)
- **Perigo**: `#EF4444` (Vermelho para perdas)

### Tipografia
- **Família**: System fonts (San Francisco, Segoe UI, Roboto)
- **Hierarquia**: Títulos grandes para valores, texto menor para detalhes
- **Pesos**: Normal (400), Medium (500), Semibold (600), Bold (700)

### Componentes
- **Cartões**: Cantos arredondados, sombras sutis, bordas
- **Botões**: Estados hover, transições suaves, feedback visual
- **Navegação**: Bottom navigation com 5 tabs principais
- **Gráficos**: SVG nativo com interatividade e tooltips

## 📱 Páginas e Navegação

### 1. Dashboard
- Visão geral de vendas e receitas
- Gráfico de crescimento semanal
- Transações recentes
- Indicadores de performance

### 2. Lucros
- Gráfico de rosca mensal
- Segmentação por categoria
- Vendas recentes
- Análise de receitas

### 3. Saldo
- Perfil do usuário
- Saldo atual e tendências
- Lista de transações
- Botão de analytics

### 4. Categorias
- Gastos por categoria
- Gráfico de distribuição
- Orçamentos e limites
- Controle de despesas

### 5. Metas
- Objetivos financeiros
- Barras de progresso
- Orçamento mensal
- Planejamento futuro

## 🔧 Funcionalidades Técnicas

### PWA Features
- ✅ Service Worker para cache offline
- ✅ Manifest.json para instalação
- ✅ Cache API para performance
- ✅ Background sync para ações offline
- ✅ Push notifications (estrutura preparada)

### Performance
- Lazy loading de componentes
- Cache inteligente de recursos
- Otimização de imagens
- Compressão de assets
- Service worker para cache offline

### Acessibilidade
- Navegação por teclado
- Suporte a leitores de tela
- Alto contraste
- Redução de movimento
- Foco visual claro

## 📊 Dados e Armazenamento

### Estrutura de Dados
```javascript
{
  user: {
    name: string,
    balance: number,
    currency: string
  },
  transactions: [
    {
      id: number,
      name: string,
      amount: number,
      type: 'income' | 'expense',
      category: string,
      date: string
    }
  ],
  categories: [
    {
      name: string,
      icon: string,
      color: string,
      budget: number,
      spent: number
    }
  ],
  goals: [
    {
      id: number,
      name: string,
      target: number,
      current: number,
      icon: string,
      deadline: string
    }
  ]
}
```

### Persistência
- **LocalStorage**: Configurações e dados básicos
- **IndexedDB**: Transações e histórico completo
- **Cache API**: Recursos estáticos e offline
- **Exportação**: Backup em JSON para portabilidade

## 🚀 Deploy e Hospedagem

### GitHub Pages
1. Configure o repositório para GitHub Pages
2. O app será automaticamente publicado em `https://seu-usuario.github.io/core-finance`

### Outras Plataformas
- **Netlify**: Drag & drop do build
- **Vercel**: Deploy automático do Git
- **Firebase Hosting**: Hospedagem do Google
- **AWS S3**: Armazenamento estático

### Configuração de Domínio
- Configure CNAME para domínio personalizado
- Atualize manifest.json com nova URL
- Configure HTTPS para funcionalidades PWA

## 🧪 Testes e Qualidade

### Testes de Compatibilidade
- ✅ Chrome/Chromium (Desktop e Mobile)
- ✅ Firefox (Desktop e Mobile)
- ✅ Safari (iOS e macOS)
- ✅ Edge (Windows e Mobile)

### Testes de PWA
- ✅ Lighthouse PWA Score
- ✅ Service Worker funcionando
- ✅ Manifest válido
- ✅ Cache offline funcionando

### Testes de Performance
- ✅ Core Web Vitals
- ✅ First Contentful Paint
- ✅ Largest Contentful Paint
- ✅ Cumulative Layout Shift

## 🤝 Contribuição

### Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use Conventional Commits para mensagens
- Siga o ESLint configurado
- Mantenha a estrutura de arquivos
- Documente novas funcionalidades
- Teste em múltiplos navegadores

### Roadmap
- [ ] Integração com APIs bancárias
- [ ] Sincronização em nuvem
- [ ] Notificações push
- [ ] Modo offline avançado
- [ ] Temas personalizáveis
- [ ] Relatórios avançados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Design inspirado em interfaces financeiras modernas
- Comunidade PWA para boas práticas
- Contribuidores e testadores
- Ferramentas open source utilizadas

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/core-finance/issues)
- **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/core-finance/discussions)
- **Wiki**: [Documentação detalhada](https://github.com/seu-usuario/core-finance/wiki)

---

**Desenvolvido com ❤️ para simplificar suas finanças pessoais**

*Core - No centro das suas finanças*