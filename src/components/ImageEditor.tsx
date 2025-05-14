
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  RotateCcw,
  SlidersVertical,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  originalImage: File | null;
  previewUrl: string;
  onReset: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  originalImage,
  previewUrl,
  onReset,
}) => {
  const [brightness, setBrightness] = useState<number[]>([100]);
  const [contrast, setContrast] = useState<number[]>([100]);
  const [saturation, setSaturation] = useState<number[]>([100]);
  const [scale, setScale] = useState(1);
  const [format, setFormat] = useState('original');
  const [quality, setQuality] = useState<number[]>([80]);
  const [resizePercentage, setResizePercentage] = useState<number[]>([100]);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>(previewUrl);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [processedSize, setProcessedSize] = useState<{ width: number; height: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize the canvas with the image
  useEffect(() => {
    const image = new Image();
    image.src = previewUrl;
    
    image.onload = () => {
      setOriginalSize({
        width: image.width,
        height: image.height
      });
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Set canvas dimensions to match the image
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          
          // Store the initial processed size
          setProcessedSize({
            width: image.width,
            height: image.height
          });
          
          // Generate initial processed image URL
          updateCanvas();
        }
      }
    };
    
    return () => {
      // Clean up the object URL
      URL.revokeObjectURL(previewUrl);
      if (processedImageUrl !== previewUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [previewUrl]);

  // Update the canvas when settings change
  useEffect(() => {
    updateCanvas();
  }, [brightness, contrast, saturation, resizePercentage, format, quality]);

  const updateCanvas = () => {
    if (!canvasRef.current || !originalSize) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Calculate new dimensions based on resize percentage
    const newWidth = Math.round((originalSize.width * resizePercentage[0]) / 100);
    const newHeight = Math.round((originalSize.height * resizePercentage[0]) / 100);
    
    // Update canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw the original image to the canvas with new dimensions
    const image = new Image();
    image.src = previewUrl;
    
    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the resized image
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      
      // Apply filters
      applyFilters(ctx, canvas);
      
      // Update the processed image URL
      generateProcessedImage();
      
      // Update the processed size state
      setProcessedSize({
        width: newWidth,
        height: newHeight
      });
    };
  };

  const applyFilters = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Apply filters
    ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
    
    // Redraw the image with filters applied
    const image = new Image();
    image.src = previewUrl;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Reset the filter
    ctx.filter = 'none';
  };

  const generateProcessedImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Determine the output format
    let outputFormat = 'image/jpeg';
    if (format === 'png') {
      outputFormat = 'image/png';
    } else if (format === 'webp') {
      outputFormat = 'image/webp';
    } else if (originalImage && format === 'original') {
      outputFormat = originalImage.type;
    }
    
    // Convert the canvas to a data URL with the selected quality (0-1)
    const outputQuality = format === 'png' ? undefined : quality[0] / 100;
    const dataURL = canvas.toDataURL(outputFormat, outputQuality);
    
    // Clean up previous processed image URL
    if (processedImageUrl !== previewUrl) {
      URL.revokeObjectURL(processedImageUrl);
    }
    
    // Update the processed image URL
    setProcessedImageUrl(dataURL);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    
    // Determine the output format and file extension
    let outputFormat = 'image/jpeg';
    let fileExtension = '.jpg';
    
    if (format === 'png') {
      outputFormat = 'image/png';
      fileExtension = '.png';
    } else if (format === 'webp') {
      outputFormat = 'image/webp';
      fileExtension = '.webp';
    } else if (format === 'original') {
      // Get the original format from the file type
      outputFormat = originalImage.type;
      const originalExt = originalImage.name.split('.').pop();
      fileExtension = originalExt ? `.${originalExt.toLowerCase()}` : '.jpg';
    }
    
    // Generate a filename for the download
    const baseFilename = originalImage.name.split('.')[0] || 'image';
    const filename = `${baseFilename}-optimized${fileExtension}`;
    
    // Convert the canvas to a data URL with the selected quality (0-1)
    const outputQuality = format === 'png' ? undefined : quality[0] / 100;
    
    // Create a download link
    canvas.toBlob((blob) => {
      if (!blob) {
        toast({
          title: "Error",
          description: "Failed to generate image for download",
          variant: "destructive"
        });
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: `Image saved as ${filename}`,
      });
    }, outputFormat, outputQuality);
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setScale(1);
    setFormat('original');
    setQuality([80]);
    setResizePercentage([100]);
    updateCanvas();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="w-full h-full flex flex-col">
          <CardContent className="p-0 overflow-hidden relative flex-1 min-h-[300px]">
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] overflow-auto">
              <div className="relative" style={{ transform: `scale(${scale})` }}>
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full shadow-lg"
                  style={{ display: 'none' }}
                />
                <img 
                  src={processedImageUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full transition-all"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 bg-card border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </Button>
              <span className="text-xs">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(Math.min(3, scale + 0.1))}
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {processedSize 
                ? `${processedSize.width} × ${processedSize.height}`
                : 'Processing...'}
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="w-full h-full">
          <CardContent className="p-4">
            <Tabs defaultValue="adjust">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="adjust">
                  <SlidersVertical size={16} className="mr-2" />
                  Adjust
                </TabsTrigger>
                <TabsTrigger value="resize">
                  <ZoomIn size={16} className="mr-2" />
                  Resize
                </TabsTrigger>
                <TabsTrigger value="export">
                  <Download size={16} className="mr-2" />
                  Export
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="adjust" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brightness">Brightness</Label>
                    <span className="text-xs">{brightness[0]}%</span>
                  </div>
                  <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={brightness}
                    onValueChange={setBrightness}
                    className="brightness-slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contrast">Contrast</Label>
                    <span className="text-xs">{contrast[0]}%</span>
                  </div>
                  <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={contrast}
                    onValueChange={setContrast}
                    className="contrast-slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="saturation">Saturation</Label>
                    <span className="text-xs">{saturation[0]}%</span>
                  </div>
                  <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={saturation}
                    onValueChange={setSaturation}
                    className="saturation-slider"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="resize" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resize">Resize</Label>
                    <span className="text-xs">{resizePercentage[0]}%</span>
                  </div>
                  <Slider
                    id="resize"
                    min={10}
                    max={100}
                    step={1}
                    value={resizePercentage}
                    onValueChange={setResizePercentage}
                  />
                </div>
                
                {originalSize && processedSize && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Original:</span>
                      <span>{originalSize.width} × {originalSize.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New:</span>
                      <span>{processedSize.width} × {processedSize.height}</span>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="export" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original format</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality">
                      Quality {format !== 'png' ? `(${quality[0]}%)` : ''}
                    </Label>
                  </div>
                  {format !== 'png' ? (
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={1}
                      value={quality}
                      onValueChange={setQuality}
                      disabled={format === 'png'}
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      PNG format uses lossless compression
                    </div>
                  )}
                </div>
                
                {originalImage && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Original size:</span>
                      <span>{formatBytes(originalImage.size)}</span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
              >
                Change Image
              </Button>
              
              <Button
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
