import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
}


const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);


    const toggleTheme = (): void => {
        setIsDark(prev => !prev);
    };

    const value: ThemeContextType = {
        isDark,
        toggleTheme
    };


    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider