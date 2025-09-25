# 🎨 Design System - App de Finanças

## 📱 Identidade Visual

### Conceito
Interface **dark-first** com cards contrastantes, tipografia hierárquica e cores de destaque personalizáveis. Design minimalista focado em legibilidade e experiência premium.

### Inspiração Base
Design baseado nas referências fornecidas, com customizações para:
- Fundo preto absoluto (#000000)
- Cards em cinza contrastante
- Cores de destaque personalizáveis
- Eliminação de cards brancos

---

## 🎯 Tokens de Design

### Cores

#### **Background**
```typescript
const colors = {
  background: {
    primary: '#000000',      // Fundo principal (preto absoluto)
    secondary: '#0A0A0A',    // Fundo de modals/sheets
    tertiary: '#111111',     // Fundo de seções alternativas
  }
}
```

#### **Surface (Cards & Containers)**
```typescript
const colors = {
  surface: {
    primary: '#1A1A1A',      // Cards principais (cinza escuro)
    secondary: '#262626',    // Cards secundários
    elevated: '#2A2A2A',     // Cards com elevação/destaque
    border: '#333333',       // Bordas sutis
  }
}
```

#### **Text**
```typescript
const colors = {
  text: {
    primary: '#FFFFFF',      // Títulos e texto principal
    secondary: '#B3B3B3',    // Texto secundário/descrições
    tertiary: '#808080',     // Texto terciário/placeholders
    disabled: '#4D4D4D',     // Texto desabilitado
  }
}
```

#### **Accent (Cores de Destaque Personalizáveis)**
```typescript
const colors = {
  accent: {
    primary: '#00FF88',      // Verde neon (receitas/positivo)
    secondary: '#FF6B6B',    // Vermelho coral (despesas/negativo)
    tertiary: '#4ECDC4',     // Azul turquesa (neutro/info)
    warning: '#FFE66D',      // Amarelo (alertas)
    success: '#00FF88',      // Verde (sucesso)
  }
}
```

#### **Semantic Colors**
```typescript
const colors = {
  semantic: {
    income: '#00FF88',       // Receitas (verde neon)
    expense: '#FF6B6B',      // Despesas (vermelho coral)
    transfer: '#4ECDC4',     // Transferências (azul)
    investment: '#A855F7',   // Investimentos (roxo)
    saving: '#F59E0B',       // Economia (laranja)
  }
}
```

---

## 📏 Spacing & Layout

### Grid System
```typescript
const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
};
```

### Border Radius
```typescript
const borderRadius = {
  sm: 8,    // Elementos pequenos
  md: 16,   // Cards padrão
  lg: 24,   // Cards grandes
  xl: 32,   // Elementos especiais
  pill: 999, // Botões pill/circulares
};
```

---

## 🔤 Typography

### Font Family
- **Primary**: Sistema nativo (SF Pro iOS / Roboto Android)
- **Numeric**: Monospace para valores monetários

### Font Scales
```typescript
const fontSize = {
  xs: 12,   // Legendas, labels pequenos
  sm: 14,   // Texto corpo, descrições
  md: 16,   // Texto padrão
  lg: 18,   // Subtítulos
  xl: 20,   // Títulos de seção
  '2xl': 24, // Títulos de página
  '3xl': 32, // Valores monetários grandes
  '4xl': 48, // Valores hero/dashboard
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### Hierarquia Textual
1. **Hero Numbers**: 48px, Bold, Accent Color
2. **Page Titles**: 24px, SemiBold, Primary
3. **Section Titles**: 20px, SemiBold, Primary
4. **Card Titles**: 18px, Medium, Primary
5. **Body Text**: 16px, Regular, Primary
6. **Captions**: 14px, Regular, Secondary
7. **Labels**: 12px, Medium, Tertiary

---

## 🧩 Componentes Base

### 1. Cards
```typescript
// Card Principal
const cardStyles = {
  backgroundColor: '#1A1A1A',
  borderRadius: 16,
  padding: 20,
  marginVertical: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
}

// Card Elevado
const elevatedCardStyles = {
  ...cardStyles,
  backgroundColor: '#2A2A2A',
  shadowOpacity: 0.5,
  elevation: 8,
}

// Card de Valor (Hero)
const valueCardStyles = {
  ...elevatedCardStyles,
  backgroundColor: '#00FF88', // ou cor accent
  padding: 24,
  borderRadius: 20,
}
```

### 2. Botões
```typescript
// Botão Primário
const primaryButtonStyles = {
  backgroundColor: '#00FF88',
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 24,
  minHeight: 56,
}

// Botão Secundário
const secondaryButtonStyles = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#333333',
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 24,
  minHeight: 56,
}

// Botão Ghost/Terciário
const ghostButtonStyles = {
  backgroundColor: 'transparent',
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 20,
  minHeight: 48,
}

// FAB (Floating Action Button)
const fabStyles = {
  backgroundColor: '#00FF88',
  width: 56,
  height: 56,
  borderRadius: 28,
  position: 'absolute',
  bottom: 24,
  right: 24,
  shadowColor: '#00FF88',
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 8,
}
```

### 3. Inputs
```typescript
const inputStyles = {
  backgroundColor: '#1A1A1A',
  borderWidth: 1,
  borderColor: '#333333',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 20,
  fontSize: 16,
  color: '#FFFFFF',
  minHeight: 56,
}

const focusedInputStyles = {
  ...inputStyles,
  borderColor: '#00FF88',
  shadowColor: '#00FF88',
  shadowOpacity: 0.2,
  shadowRadius: 8,
}
```

---

## 📊 Componentes Específicos

### 1. Balance Card (Card de Saldo)
```typescript
const balanceCardProps = {
  backgroundColor: '#00FF88', // Cor accent principal
  borderRadius: 20,
  padding: 24,
  minHeight: 120,
  // Gradient opcional:
  // backgroundGradient: ['#00FF88', '#00CC6A']
}
```

### 2. Transaction Item
```typescript
const transactionItemStyles = {
  backgroundColor: '#1A1A1A',
  borderRadius: 12,
  padding: 16,
  marginVertical: 4,
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 72,
}
```

### 3. Category Pills
```typescript
const categoryPillStyles = {
  backgroundColor: '#262626',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginRight: 8,
  borderWidth: 1,
  borderColor: 'transparent',
}

const activeCategoryPillStyles = {
  ...categoryPillStyles,
  backgroundColor: '#00FF88',
  borderColor: '#00FF88',
}
```

### 4. Charts & Graphs
```typescript
const chartStyles = {
  backgroundColor: '#1A1A1A',
  borderRadius: 16,
  padding: 20,
  // Cores das linhas/barras
  lineColor: '#00FF88',
  gridColor: '#333333',
  labelColor: '#B3B3B3',
}
```

---

## 🎭 Estados Visuais

### Loading States
- **Skeleton**: Background `#1A1A1A` com shimmer `#2A2A2A`
- **Spinners**: Cor accent primária (`#00FF88`)

### Empty States
- **Ilustração**: Ícones em `#808080`
- **Texto**: "Nenhuma transação encontrada" em `#B3B3B3`

### Error States
- **Cor**: `#FF6B6B`
- **Background**: `#1A1A1A` com borda `#FF6B6B`

---

## 🌙 Dark Mode (Padrão)

O app é **dark-first**, mas podemos ter tokens para modo claro futuramente:

```typescript
// Futuro Light Mode (opcional)
const lightModeColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F9F9F9',
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
  },
}
```

---

## 🎨 Customização de Cores

### Como Personalizar Cores de Destaque
```typescript
// No arquivo theme/colors.ts
export const createCustomAccent = (primaryColor: string) => ({
  primary: primaryColor,
  secondary: adjustBrightness(primaryColor, -20),
  light: adjustBrightness(primaryColor, 30),
  dark: adjustBrightness(primaryColor, -40),
});

// Exemplos de paletas
const greenAccent = createCustomAccent('#00FF88');
const blueAccent = createCustomAccent('#007AFF');
const purpleAccent = createCustomAccent('#AF52DE');
```

---

## 📱 Responsividade & Plataforma

### Breakpoints
```typescript
const breakpoints = {
  small: 375,   // iPhone SE
  medium: 390,  // iPhone 12/13/14
  large: 430,   // iPhone 12 Pro Max
  tablet: 768,  // iPad
};
```

### Platform Specific
```typescript
// iOS
const iosStyles = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
};

// Android
const androidStyles = {
  elevation: 4,
};
```

---

## ✅ Checklist de Implementação

Para cada nova tela/componente, verificar:

- [ ] **Fundo**: Sempre `#000000` (preto absoluto)
- [ ] **Cards**: Usar `#1A1A1A` ou `#2A2A2A` para destaque
- [ ] **Texto**: Hierarquia clara com cores definidas
- [ ] **Spacing**: Seguir grid de 8px (4, 8, 16, 24, 32, 48)
- [ ] **Border Radius**: 16px para cards, 12px para inputs
- [ ] **Cores de Destaque**: Usar tokens personalizáveis
- [ ] **Acessibilidade**: Contraste mínimo WCAG AA
- [ ] **Estados**: Loading, empty, error implementados
- [ ] **Animações**: Transições de 200-300ms

---

## 🎯 Exemplos de Uso

### Tela de Dashboard
```typescript
const DashboardScreen = () => (
  <View style={{ backgroundColor: '#000000', flex: 1 }}>
    {/* Balance Card */}
    <View style={[cardStyles, { backgroundColor: '#00FF88' }]}>
      <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#000' }}>
        $16,125
      </Text>
    </View>
    
    {/* Action Buttons */}
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <TouchableOpacity style={[primaryButtonStyles, { flex: 1 }]}>
        <Text>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[secondaryButtonStyles, { flex: 1 }]}>
        <Text>Investir</Text>
      </TouchableOpacity>
    </View>
    
    {/* Transaction List */}
    <View style={cardStyles}>
      <Text style={{ fontSize: 20, fontWeight: 'semibold', color: '#FFF' }}>
        Transações Recentes
      </Text>
      {/* Transaction items */}
    </View>
  </View>
);
```

---

**Este design system garante consistência visual em todo o app, mantendo a identidade dark elegante com cores de destaque personalizáveis e maximum contrast para melhor legibilidade.**
