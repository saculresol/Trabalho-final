import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeColors = {
    light: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#4CAF50',
      secondary: '#E0E0E0',
    },
    dark: {
      background: '#121212',
      text: '#FFFFFF',
      primary: '#81C784',
      secondary: '#1E1E1E',
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: themeColors[theme], 
        themeColors
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
