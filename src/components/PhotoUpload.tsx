"use client";

import { useState, useRef } from "react";
import { Upload, X, Check } from "lucide-react";

interface PhotoUploadProps {
  itemId: string;
  onPhotoUploaded: (photo: string) => void;
  isUploaded: boolean;
}

export default function PhotoUpload({ itemId, onPhotoUploaded, isUploaded }: PhotoUploadProps) {
  const [photo, setPhoto] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhoto(result);
        onPhotoUploaded(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-6">
      {!isUploaded && !photo ? (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging ? "border-orange bg-orange/10" : "border-white/20 hover:border-orange/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-semibold mb-2">Upload Handwritten Notes</p>
          <p className="text-xs opacity-70 mb-4">
            Drag & drop an image or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-orange to-ocean text-white text-sm hover:opacity-90 transition-opacity"
          >
            Select Photo
          </button>
        </div>
      ) : (
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold">Handwritten Notes Uploaded</span>
            </div>
            <button
              onClick={handleRemove}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>
          {photo && (
            <div className="relative rounded-lg overflow-hidden bg-black/5">
              <img src={photo} alt="Handwritten notes" className="w-full h-48 object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
