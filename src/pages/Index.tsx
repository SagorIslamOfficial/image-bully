
import { useState } from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 border-b border-border">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Image Optimizer
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload, optimize, and convert your images with ease
          </p>
        </div>
      </header>

      <main className="flex-1 py-8">
        <ImageOptimizer />
      </main>

      <footer className="py-6 px-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          Built with React, Tailwind CSS, and Shadcn UI &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
