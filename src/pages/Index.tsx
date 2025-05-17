
import { useState, useEffect } from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

const Index = () => {
  const { theme, setTheme } = useTheme();
  
  // Force dark mode to be applied on initial load
  useEffect(() => {
    if (!theme) {
      setTheme('dark');
    }
  }, [theme, setTheme]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-3 px-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Image Optimizer
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Upload, optimize, and convert your images with ease
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-4 container mx-auto px-4">
        <ImageOptimizer />
      </main>

      <footer className="py-3 px-4 border-t border-border text-center text-xs text-muted-foreground">
        <p>
          Built with React, Tailwind CSS, and Shadcn UI &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
