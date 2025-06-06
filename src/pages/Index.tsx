
import { useState } from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 px-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Image Optimizer
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Upload, optimize, and convert your images with ease
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-6">
        <ImageOptimizer />
      </main>

      <footer className="py-4 px-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          AIS &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
