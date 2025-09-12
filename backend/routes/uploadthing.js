import { Router } from 'express';
import { UTApi } from 'uploadthing/server';
import { uploadRouter } from '../uploadthing/core.js';
import { createRouteHandler } from 'uploadthing/express';

const router = Router();

// Create the route handler for uploads
const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});

// Add CORS headers for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Handle file uploads
router.post('/', async (req, res) => {
  try {
    await POST(req, res);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process upload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handle file deletions
router.delete('/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params;
    
    if (!fileKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'File key is required' 
      });
    }
    
    const utapi = new UTApi({
      apiKey: process.env.UPLOADTHING_SECRET,
    });
    
    const result = await utapi.deleteFiles(fileKey);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true,
        message: 'File deleted successfully' 
      });
    } else {
      console.error('Failed to delete file:', result.error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete file',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete file',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'uploadthing',
    timestamp: new Date().toISOString()
  });
});

export default router;