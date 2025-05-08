import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definindo os tipos de tema
export type ThemeType = 'light' | 'dark';

// Interface para o contexto do tema
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

// Criando o contexto com um valor padrão
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Hook personalizado para usar o contexto do tema
export const useTheme = () => useContext(ThemeContext);

// Props para o provedor de tema
interface ThemeProviderProps {
  children: ReactNode;
}

// Provedor de tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Verificar se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verificar se o usuário prefere o tema escuro no sistema
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Retornar o tema salvo ou o tema preferido do sistema
    return (savedTheme as ThemeType) || (prefersDarkMode ? 'dark' : 'light');
  });

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Efeito para salvar o tema no localStorage quando ele mudar
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Adicionar ou remover a classe 'dark-theme' do elemento html
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // Efeito para detectar mudanças na preferência de tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    // Adicionar listener para mudanças na preferência de tema
    mediaQuery.addEventListener('change', handleChange);
    
    // Remover listener quando o componente for desmontado
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};