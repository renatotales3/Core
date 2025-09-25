export const colors = {
  // Background
  background: {
    primary: '#000000',      // Fundo principal (preto absoluto)
    secondary: '#0A0A0A',    // Fundo de modals/sheets
    tertiary: '#111111',     // Fundo de seções alternativas
  },

  // Surface (Cards & Containers)
  surface: {
    primary: '#1A1A1A',      // Cards principais (cinza escuro)
    secondary: '#262626',    // Cards secundários
    elevated: '#2A2A2A',     // Cards com elevação/destaque
    border: '#333333',       // Bordas sutis
  },

  // Text
  text: {
    primary: '#FFFFFF',      // Títulos e texto principal
    secondary: '#B3B3B3',    // Texto secundário/descrições
    tertiary: '#808080',     // Texto terciário/placeholders
    disabled: '#4D4D4D',     // Texto desabilitado
  },

  // Accent (Cores de Destaque)
  accent: {
    primary: '#4F46E5',      // Azul royal (adaptado das telas de referência)
    secondary: '#FF6B6B',    // Vermelho coral (despesas/negativo)
    tertiary: '#4ECDC4',     // Azul turquesa (neutro/info)
    warning: '#FFE66D',      // Amarelo (alertas)
    success: '#00FF88',      // Verde (sucesso)
  },

  // Semantic Colors
  semantic: {
    income: '#00FF88',       // Receitas (verde neon)
    expense: '#FF6B6B',      // Despesas (vermelho coral)
    transfer: '#4ECDC4',     // Transferências (azul)
    investment: '#A855F7',   // Investimentos (roxo)
    saving: '#F59E0B',       // Economia (laranja)
  }
};

// Helper function for custom accents
export const createCustomAccent = (primaryColor: string) => ({
  primary: primaryColor,
  secondary: adjustBrightness(primaryColor, -20),
  light: adjustBrightness(primaryColor, 30),
  dark: adjustBrightness(primaryColor, -40),
});

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}