import { createRouteHandler } from "uploadthing/express";
import { UTApi } from "uploadthing/server";

export const { GET, POST } = createRouteHandler({
  // Your configuration options here
  // Make sure to set up proper CORS and authentication
});

// Optional: Add a route to delete files if needed
export const DELETE = async (req, res) => {
  const { fileKey } = await req.json();
  const utapi = new UTApi();
  await utapi.deleteFiles(fileKey);
  return res.status(200).json({ success: true });
};
