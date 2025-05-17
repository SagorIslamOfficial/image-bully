
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eraser, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch"

interface BackgroundRemoverProps {
  onRemoveBackground: () => void;
  onChangeBackground: (color: string) => void;
  isProcessing: boolean;
  bgColor: string;
  setBgColor: (color: string) => void;
  isTransparent: boolean;
  setIsTransparent: (isTransparent: boolean) => void;
}

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({
  onRemoveBackground,
  onChangeBackground,
  isProcessing,
  bgColor,
  setBgColor,
  isTransparent,
  setIsTransparent
}) => {
  const { toast } = useToast();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    onChangeBackground(newColor);
  };

  const handleTransparencyToggle = (checked: boolean) => {
    setIsTransparent(checked);
    if (checked) {
      toast({
        title: "Transparency enabled",
        description: "Background will be transparent when downloaded",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Background</h3>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={onRemoveBackground} 
          disabled={isProcessing}
          className="w-full"
        >
          <Eraser className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Remove Background"}
        </Button>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="transparentBg">Transparent Background</Label>
            <Switch 
              id="transparentBg" 
              checked={isTransparent}
              onCheckedChange={handleTransparencyToggle}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Background Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={bgColor}
              onChange={handleColorChange}
              disabled={isTransparent}
              className="w-10 h-8 p-0 border-0"
            />
            <Input
              type="text"
              value={bgColor}
              onChange={handleColorChange}
              disabled={isTransparent}
              className="font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Color will be applied when background is removed
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
