'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Element } from '@/types';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function ImageElement({ element, onUpdate }: ImageElementProps) {
  const [imageUrl, setImageUrl] = useState(element.props?.imageUrl || '');
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImageUrl(url);
        onUpdate(element.id, { 
          props: { ...element.props, imageUrl: url } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        backgroundColor: element.styles.backgroundColor || '#f3f4f6',
        borderRadius: element.styles.borderRadius || 0,
        border: element.styles.border || 'none',
        borderColor: element.styles.borderColor || 'transparent',
        borderWidth: element.styles.borderWidth || 0,
        opacity: element.styles.opacity || 1,
        boxShadow: element.styles.boxShadow || 'none',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Uploaded content"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-sm">Click to upload image</span>
        </div>
      )}
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-white">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload Image</span>
          </div>
        </div>
      )}
    </div>
  );
}
