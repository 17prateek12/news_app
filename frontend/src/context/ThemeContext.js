import { createContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState('light');

  useEffect(() => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const switchDark = () => setDarkMode('dark');
  const switchLight = () => setDarkMode('light');

  return (
    <ThemeContext.Provider value={{ darkMode, switchDark, switchLight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;