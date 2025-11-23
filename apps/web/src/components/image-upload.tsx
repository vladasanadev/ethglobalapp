"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  label?: string;
}

export function ImageUpload({
  onImageSelect,
  maxSizeMB = 5,
  acceptedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  label = "Upload Screenshot"
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedFormats.join(", ")}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File too large. Max size: ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onImageSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-4 border-dashed p-12 text-center cursor-pointer
            transition-all font-inter
            ${isDragging ? "border-yellow bg-yellow/20" : "border-black bg-white hover:border-yellow"}
          `}
        >
          <div className="space-y-3">
            <div className="text-5xl">📸</div>
            <p className="font-alpina text-2xl italic">Click to upload or drag & drop</p>
            <p className="text-xs text-brown uppercase tracking-wider">
              PNG, JPG, WEBP up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-4 border-black overflow-hidden bg-black">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-6 py-3 bg-white text-black border-4 border-black hover:bg-tan transition-colors font-inter font-bold uppercase tracking-wider text-sm"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-1 px-6 py-3 bg-black text-yellow border-4 border-black hover:bg-red-900 hover:text-white transition-colors font-inter font-bold uppercase tracking-wider text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-4 bg-red-900/50 text-red-200 text-sm border-4 border-red-500 font-inter">
          <p className="font-bold uppercase tracking-wider mb-1">ERROR</p>
          <p>{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}

