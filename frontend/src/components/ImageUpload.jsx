import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

const ImageUpload = ({ onImageChange, currentImage }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      setUploadProgress(30); // Show some initial progress
      
      const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        toast.success('Image uploaded successfully!');
        onImageChange(response.data.url);
        return response.data.url;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validations
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file (JPEG, PNG, etc.)');
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB
      return toast.error('Image size must be less than 4MB.');
    }

    try {
      // Show preview
      const previewUrl = URL.createObjectURL(file);
      onImageChange(previewUrl);
      
      // Start the actual upload
      await uploadImage(file);
    } catch (error) {
      onImageChange('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeImage = () => {
    // Note: You might want to implement actual deletion from Cloudinary
    // using the public ID when you have it
    toast.success('Image removed from question.');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !currentImage && fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center text-center transition-colors duration-200
          ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'}
          ${!currentImage && 'cursor-pointer'}
          ${currentImage && 'min-h-[150px]'}
        `}
      >
        {currentImage ? (
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt="Uploaded preview"
              className="rounded-md w-full h-full max-h-48 object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
              onClick={removeImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center space-y-3 w-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-muted">
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 4MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;