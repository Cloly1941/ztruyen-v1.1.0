'use client';

// ** React
import React from 'react';

// ** Theme
import { useTheme } from 'next-themes';

// ** lucide icon
import { Moon, Sun } from 'lucide-react';

// ** Components
import Button from '@/components/common/Button';

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button variant="ghost" onClick={toggleTheme}>
            <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}