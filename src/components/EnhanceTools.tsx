
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Wand, ZoomIn } from 'lucide-react';

interface EnhanceToolsProps {
  noiseReduction: number[];
  setNoiseReduction: (value: number[]) => void;
  sharpen: number[];
  setSharpen: (value: number[]) => void;
  upscaleFactor: number;
  setUpscaleFactor: (value: number) => void;
  onRestoreImage: () => void;
  onUpscaleImage: () => void;
  isProcessing: boolean;
}

const EnhanceTools: React.FC<EnhanceToolsProps> = ({
  noiseReduction,
  setNoiseReduction,
  sharpen,
  setSharpen,
  upscaleFactor,
  setUpscaleFactor,
  onRestoreImage,
  onUpscaleImage,
  isProcessing
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Clean Old Photos</h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="noise-reduction">Noise Reduction</Label>
              <span className="text-xs">{noiseReduction[0]}%</span>
            </div>
            <Slider
              id="noise-reduction"
              min={0}
              max={100}
              step={1}
              value={noiseReduction}
              onValueChange={setNoiseReduction}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sharpen">Sharpen</Label>
              <span className="text-xs">{sharpen[0]}%</span>
            </div>
            <Slider
              id="sharpen"
              min={0}
              max={100}
              step={1}
              value={sharpen}
              onValueChange={setSharpen}
            />
          </div>
          
          <Button 
            onClick={onRestoreImage} 
            className="w-full mt-2"
            disabled={isProcessing}
          >
            <Wand size={14} className="mr-2" />
            Restore Old Photo
          </Button>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-medium mb-4">Upscale Image</h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="upscale-factor">Upscale Factor</Label>
            <Select
              value={String(upscaleFactor)}
              onValueChange={(value) => setUpscaleFactor(parseFloat(value))}
            >
              <SelectTrigger id="upscale-factor">
                <SelectValue placeholder="Select factor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="3">3x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onUpscaleImage} 
            className="w-full mt-2"
            disabled={isProcessing}
          >
            <ZoomIn size={14} className="mr-2" />
            Upscale Image
          </Button>
          
          <div className="text-xs text-muted-foreground mt-2">
            Upscale enlarges your image while preserving quality using AI enhancement
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhanceTools;
