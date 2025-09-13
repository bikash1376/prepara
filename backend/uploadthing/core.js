import { createUploadthing } from 'uploadthing/express';

const f = createUploadthing();

/**
 * This is your UploadThing file router. You can enable file type restrictions and
 * other FileRoute options to control what files can be uploaded.
 */
export const uploadRouter = {
  // Define as many file types as you need
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
      // Optional: Add more specific file types if needed
      // fileTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    },
  })
  .middleware(async ({ req, res }) => {
    // This code runs on the server before upload
    // Add any authentication/authorization logic here
    // console.log('Upload middleware - checking auth');
    
    // Example: Verify user is authenticated
    // if (!req.user) {
    //   throw new Error('Unauthorized');
    // }
    
    // Return any metadata you want to access in onUploadComplete
    return { 
      userId: req.user?.id || 'anonymous',
      // Add any other metadata you need
    };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    // This code runs after successful upload
    // console.log('Upload completed:', { file, metadata });
    
    // You can perform any additional operations here, like:
    // - Store the file URL in your database
    // - Create thumbnails
    // - Trigger other services
    
    // Return any data you want to be available in the client
    return { 
      url: file.url,
      name: file.name,
      size: file.size,
      // Add any other file metadata you need
    };
  }),
};

// Export the router for use in your backend
// TypeScript users can import this type in their frontend code
