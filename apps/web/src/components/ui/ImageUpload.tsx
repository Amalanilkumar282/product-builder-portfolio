"use client";

import React, { useState } from 'react';
import { uploadApi } from '@/lib/admin-api';

interface ImageUploadProps {
  entityType: 'profile' | 'project';
  entityId: string;
  onUploadSuccess?: (url: string) => void;
  currentImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  entityType,
  entityId,
  onUploadSuccess,
  currentImageUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const data = await uploadApi.upload(file, entityType, entityId);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setPreviewUrl(data.url);
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
      
      // Success feedback
      setTimeout(() => {
        setFile(null);
        setProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during upload.');
      console.error('Upload error:', err);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      {previewUrl && (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full h-full object-cover ${
              entityType === 'profile' ? 'rounded-full' : 'rounded-xl'
            } border-2 border-default shadow-lg`}
          />
        </div>
      )}

      {/* File Input */}
      <div className="flex flex-col gap-2">
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${entityId}`}
          />
          <div className="glass rounded-xl px-4 py-3 text-sm text-center text-primary border border-default hover:border-accent transition-all cursor-pointer">
            {file ? file.name : 'Choose Image'}
          </div>
        </label>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full px-4 py-3 rounded-xl text-white font-medium text-sm transition-all ${
            !file || uploading
              ? 'bg-white/10 text-muted cursor-not-allowed'
              : 'gradient-bg hover:opacity-90 shadow-lg shadow-accent'
          }`}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload Image'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted text-center">
        Max size: 5MB • Formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default ImageUpload;
