import { generateReactHelpers } from '@uploadthing/react';

// Base URL for uploads
export const UPLOADTHING_URL = import.meta.env.VITE_UPLOADTHING_URL || 'http://localhost:5000/api/uploadthing';

// Generate the helpers with proper typing
export const { useUploadThing, uploadFiles } = generateReactHelpers({
  // This URL should point to your backend's UploadThing endpoint
  url: UPLOADTHING_URL,
  
  // Optional: Add default headers for all requests
  headers: () => ({
    'Content-Type': 'application/json',
    // Add any other default headers you need
  }),
  
  // Optional: Add default options for all uploads
  defaultOptions: {
    onUploadBegin: (file) => {
      // console.log('Upload starting:', file.name);
    },
    onUploadProgress: (progress) => {
      // console.log(`Upload progress: ${progress}%`);
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
    },
    onClientUploadComplete: (res) => {
      // console.log('Upload completed:', res);
    },
  },
});

// Helper function to delete a file
export const deleteFile = async (fileKey) => {
  try {
    const response = await fetch(`${UPLOADTHING_URL}/${encodeURIComponent(fileKey)}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete file');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
