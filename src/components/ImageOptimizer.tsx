
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageEditor from './ImageEditor';

const ImageOptimizer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageUpload = (file: File, url: string) => {
    setImage(file);
    setPreviewUrl(url);
  };

  const handleReset = () => {
    // Clean up the old object URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl('');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      {!image ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <ImageEditor
          originalImage={image}
          previewUrl={previewUrl}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default ImageOptimizer;
