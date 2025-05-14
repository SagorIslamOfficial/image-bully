
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash } from 'lucide-react';

// Define a TextOverlayItem interface for better type safety
interface TextOverlayItem {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface TextOverlayProps {
  textOverlays: Array<TextOverlayItem>;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextOverlayItem>) => void;
  onDeleteText: (id: string) => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({ 
  textOverlays, 
  onAddText, 
  onUpdateText, 
  onDeleteText 
}) => {
  const fontFamilies = [
    'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 
    'Courier New', 'Verdana', 'Impact'
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Text Overlays</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddText}
          className="flex items-center gap-1"
        >
          <Plus size={14} />
          Add Text
        </Button>
      </div>
      
      {textOverlays.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Click "Add Text" to place text on your image
        </div>
      ) : (
        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
          {textOverlays.map((overlay) => (
            <div key={overlay.id} className="space-y-3 border-b pb-4 border-border last:border-0 last:pb-0">
              <div className="flex justify-between items-start gap-2">
                <Input
                  value={overlay.text}
                  onChange={(e) => onUpdateText(overlay.id, { text: e.target.value })}
                  placeholder="Enter text"
                  className="flex-1"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteText(overlay.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select 
                    value={overlay.fontFamily} 
                    onValueChange={(value) => onUpdateText(overlay.id, { fontFamily: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Font Size</Label>
                    <span className="text-xs">{overlay.fontSize}px</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={1}
                    value={[overlay.fontSize]}
                    onValueChange={(value) => onUpdateText(overlay.id, { fontSize: value[0] })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={overlay.color}
                      onChange={(e) => onUpdateText(overlay.id, { color: e.target.value })}
                      className="w-10 h-8 p-0 border-0"
                    />
                    <Input
                      type="text"
                      value={overlay.color}
                      onChange={(e) => onUpdateText(overlay.id, { color: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <Label className="text-xs">X Position</Label>
                    <Input
                      type="number"
                      value={overlay.x}
                      onChange={(e) => onUpdateText(overlay.id, { x: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y Position</Label>
                    <Input
                      type="number"
                      value={overlay.y}
                      onChange={(e) => onUpdateText(overlay.id, { y: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextOverlay;
