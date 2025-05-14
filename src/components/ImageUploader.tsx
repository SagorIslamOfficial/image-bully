
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploaderProps {
  onImageUpload: (file: File, previewUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file format",
        description: "Please upload an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Create object URL for preview
    const previewUrl = URL.createObjectURL(file);
    onImageUpload(file, previewUrl);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-all ${
            isDragging ? 'drag-active' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload an image</h3>
          <p className="text-muted-foreground text-sm mb-4 text-center">
            Drag and drop an image here, or click to select a file
          </p>
          <Button 
            onClick={handleButtonClick}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Select image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload image"
          />
          <p className="text-xs text-muted-foreground mt-4">
            Max file size: 10MB. Supported formats: JPG, PNG, WebP, GIF
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
