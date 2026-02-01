'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Initialize theme from local storage or system preference
    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button className="flex items-center gap-2 px-4 py-3 border-b-4 border-gray-400 dark:border-gray-950 bg-gray-200 dark:bg-gray-800 opacity-50 cursor-default font-bold text-xs uppercase shadow-md text-gray-900 dark:text-white">
                <Sun size={16} className="text-gray-900 dark:text-white" /> <span className="hidden sm:inline">Light</span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={`
                flex items-center gap-2 px-4 py-3 
                border-b-4 active:border-b-0 active:translate-y-1 
                font-bold text-xs uppercase shadow-md transition-all
                ${isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-950'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 border-gray-400'
                }
            `}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <>
                    <Moon size={16} /> <span className="hidden sm:inline">Dark</span>
                </>
            ) : (
                <>
                    <Sun size={16} /> <span className="hidden sm:inline">Light</span>
                </>
            )}
        </button>
    );
}
