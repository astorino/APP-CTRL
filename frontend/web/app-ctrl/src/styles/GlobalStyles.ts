import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Variáveis CSS para o tema claro */
  :root {
    /* Cores primárias */
    --color-primary: #007bff;
    --color-primary-light: #4da3ff;
    --color-primary-dark: #0056b3;
    
    /* Cores secundárias */
    --color-secondary: #6c757d;
    --color-secondary-light: #868e96;
    --color-secondary-dark: #495057;
    
    /* Cores de fundo */
    --color-background: #f8f9fa;
    --color-surface: #ffffff;
    
    /* Cores de texto */
    --color-text-primary: #212529;
    --color-text-secondary: #6c757d;
    --color-text-disabled: #adb5bd;
    
    /* Cores de estado */
    --color-success: #28a745;
    --color-warning: #ffc107;
    --color-error: #dc3545;
    --color-info: #17a2b8;
    
    /* Cores de borda */
    --color-border: #dee2e6;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    
    /* Tamanhos de fonte */
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-md: 1rem;      /* 16px */
    --font-size-lg: 1.125rem;  /* 18px */
    --font-size-xl: 1.25rem;   /* 20px */
    --font-size-2xl: 1.5rem;   /* 24px */
    --font-size-3xl: 1.875rem; /* 30px */
    --font-size-4xl: 2.25rem;  /* 36px */
    
    /* Espaçamento */
    --spacing-xs: 0.25rem;  /* 4px */
    --spacing-sm: 0.5rem;   /* 8px */
    --spacing-md: 1rem;     /* 16px */
    --spacing-lg: 1.5rem;   /* 24px */
    --spacing-xl: 2rem;     /* 32px */
    --spacing-2xl: 3rem;    /* 48px */
    
    /* Bordas */
    --border-radius-sm: 0.25rem; /* 4px */
    --border-radius-md: 0.5rem;  /* 8px */
    --border-radius-lg: 1rem;    /* 16px */
    --border-radius-full: 9999px;
    
    /* Transições */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    --transition-slow: 500ms ease;
    
    /* Foco */
    --focus-ring-color: rgba(0, 123, 255, 0.25);
    --focus-ring-width: 0.25rem;
    
    /* Z-index */
    --z-index-dropdown: 1000;
    --z-index-sticky: 1020;
    --z-index-fixed: 1030;
    --z-index-modal-backdrop: 1040;
    --z-index-modal: 1050;
    --z-index-popover: 1060;
    --z-index-tooltip: 1070;
  }
  
  /* Variáveis CSS para o tema escuro */
  .dark-theme {
    /* Cores primárias */
    --color-primary: #4da3ff;
    --color-primary-light: #80bdff;
    --color-primary-dark: #0069d9;
    
    /* Cores secundárias */
    --color-secondary: #868e96;
    --color-secondary-light: #adb5bd;
    --color-secondary-dark: #6c757d;
    
    /* Cores de fundo */
    --color-background: #121212;
    --color-surface: #1e1e1e;
    
    /* Cores de texto */
    --color-text-primary: #f8f9fa;
    --color-text-secondary: #adb5bd;
    --color-text-disabled: #6c757d;
    
    /* Cores de estado */
    --color-success: #5dd879;
    --color-warning: #ffda6a;
    --color-error: #f77;
    --color-info: #4dd4e1;
    
    /* Cores de borda */
    --color-border: #343a40;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  }
  
  /* Variáveis CSS para alto contraste */
  .high-contrast {
    /* Cores primárias */
    --color-primary: #0066ff;
    --color-primary-light: #3399ff;
    --color-primary-dark: #0033cc;
    
    /* Cores de fundo */
    --color-background: #000000;
    --color-surface: #121212;
    
    /* Cores de texto */
    --color-text-primary: #ffffff;
    --color-text-secondary: #eeeeee;
    --color-text-disabled: #aaaaaa;
    
    /* Cores de estado */
    --color-success: #00cc00;
    --color-warning: #ffcc00;
    --color-error: #ff0000;
    --color-info: #00ccff;
    
    /* Cores de borda */
    --color-border: #ffffff;
    
    /* Foco */
    --focus-ring-color: #ffff00;
    --focus-ring-width: 0.25rem;
  }
  
  /* Tamanhos de texto para acessibilidade */
  .text-size-normal {
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-md: 1rem;      /* 16px */
    --font-size-lg: 1.125rem;  /* 18px */
    --font-size-xl: 1.25rem;   /* 20px */
    --font-size-2xl: 1.5rem;   /* 24px */
    --font-size-3xl: 1.875rem; /* 30px */
    --font-size-4xl: 2.25rem;  /* 36px */
  }
  
  .text-size-large {
    --font-size-xs: 0.875rem;  /* 14px */
    --font-size-sm: 1rem;      /* 16px */
    --font-size-md: 1.125rem;  /* 18px */
    --font-size-lg: 1.25rem;   /* 20px */
    --font-size-xl: 1.5rem;    /* 24px */
    --font-size-2xl: 1.75rem;  /* 28px */
    --font-size-3xl: 2.25rem;  /* 36px */
    --font-size-4xl: 2.75rem;  /* 44px */
  }
  
  .text-size-extra-large {
    --font-size-xs: 1rem;      /* 16px */
    --font-size-sm: 1.125rem;  /* 18px */
    --font-size-md: 1.25rem;   /* 20px */
    --font-size-lg: 1.5rem;    /* 24px */
    --font-size-xl: 1.75rem;   /* 28px */
    --font-size-2xl: 2rem;     /* 32px */
    --font-size-3xl: 2.5rem;   /* 40px */
    --font-size-4xl: 3rem;     /* 48px */
  }
  
  /* Redução de movimento */
  .reduced-motion {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
    
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
  
  /* Estilos globais */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: background-color var(--transition-normal), color var(--transition-normal);
  }
  
  #root {
    height: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-md);
    font-weight: 600;
    line-height: 1.2;
  }
  
  h1 {
    font-size: var(--font-size-4xl);
  }
  
  h2 {
    font-size: var(--font-size-3xl);
  }
  
  h3 {
    font-size: var(--font-size-2xl);
  }
  
  h4 {
    font-size: var(--font-size-xl);
  }
  
  h5 {
    font-size: var(--font-size-lg);
  }
  
  h6 {
    font-size: var(--font-size-md);
  }
  
  p {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-md);
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--color-primary-dark);
      text-decoration: underline;
    }
    
    &:focus {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: 2px;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: var(--font-size-md);
  }
  
  button, input[type="button"], input[type="submit"] {
    cursor: pointer;
  }
  
  /* Foco visível para acessibilidade */
  :focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
  
  /* Estilos para interface simplificada */
  .simplified-ui {
    --border-radius-sm: 0.125rem; /* 2px */
    --border-radius-md: 0.25rem;  /* 4px */
    --border-radius-lg: 0.5rem;   /* 8px */
    
    button, .button, input, select, textarea {
      border-radius: var(--border-radius-sm) !important;
    }
    
    /* Reduzir animações e efeitos */
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
  }
`;

export default GlobalStyles;