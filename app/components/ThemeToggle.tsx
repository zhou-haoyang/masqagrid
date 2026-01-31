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
            <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-50 cursor-default">
                <Sun className="w-5 h-5 text-slate-800 dark:text-slate-200" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-slate-200" />
            ) : (
                <Sun className="w-5 h-5 text-slate-800" />
            )}
        </button>
    );
}
