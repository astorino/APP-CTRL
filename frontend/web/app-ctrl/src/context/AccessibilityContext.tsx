import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definindo os tipos de tamanho de texto
export type TextSizeType = 'normal' | 'large' | 'extra-large';

// Interface para as configurações de acessibilidade
export interface AccessibilitySettings {
  textSize: TextSizeType;
  highContrast: boolean;
  reducedMotion: boolean;
  simplifiedUI: boolean;
}

// Interface para o contexto de acessibilidade
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateTextSize: (size: TextSizeType) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleSimplifiedUI: () => void;
  resetSettings: () => void;
}

// Configurações padrão
const defaultSettings: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  simplifiedUI: false,
};

// Criando o contexto com um valor padrão
const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateTextSize: () => {},
  toggleHighContrast: () => {},
  toggleReducedMotion: () => {},
  toggleSimplifiedUI: () => {},
  resetSettings: () => {},
});

// Hook personalizado para usar o contexto de acessibilidade
export const useAccessibility = () => useContext(AccessibilityContext);

// Props para o provedor de acessibilidade
interface AccessibilityProviderProps {
  children: ReactNode;
}

// Provedor de acessibilidade
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Estado para armazenar as configurações de acessibilidade
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Verificar se há configurações salvas no localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Erro ao carregar configurações de acessibilidade:', error);
        return defaultSettings;
      }
    }
    
    // Verificar preferências do sistema
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Retornar as configurações padrão com as preferências do sistema
    return {
      ...defaultSettings,
      reducedMotion: prefersReducedMotion,
    };
  });

  // Função para atualizar o tamanho do texto
  const updateTextSize = (size: TextSizeType) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  };

  // Função para alternar o alto contraste
  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  // Função para alternar a redução de movimento
  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  // Função para alternar a interface simplificada
  const toggleSimplifiedUI = () => {
    setSettings((prev) => ({ ...prev, simplifiedUI: !prev.simplifiedUI }));
  };

  // Função para redefinir as configurações para o padrão
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Efeito para salvar as configurações no localStorage quando elas mudarem
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Aplicar classes CSS com base nas configurações
    const { textSize, highContrast, reducedMotion, simplifiedUI } = settings;
    
    // Remover todas as classes de tamanho de texto
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large');
    // Adicionar a classe de tamanho de texto atual
    document.documentElement.classList.add(`text-size-${textSize}`);
    
    // Alternar classes para outras configurações
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.classList.toggle('simplified-ui', simplifiedUI);
    
  }, [settings]);

  // Efeito para detectar mudanças na preferência de redução de movimento do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
    };
    
    // Adicionar listener para mudanças na preferência de redução de movimento
    mediaQuery.addEventListener('change', handleChange);
    
    // Remover listener quando o componente for desmontado
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateTextSize,
        toggleHighContrast,
        toggleReducedMotion,
        toggleSimplifiedUI,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};