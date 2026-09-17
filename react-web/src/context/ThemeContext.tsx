import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'windows' | 'modern' | string;

export interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialTheme = queryParams.get('theme') || 'windows';
  const [theme, setTheme] = useState<string>(initialTheme);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'windows' ? 'modern' : 'windows'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};