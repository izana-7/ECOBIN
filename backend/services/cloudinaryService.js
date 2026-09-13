/**
 * Cloudinary Storage Abstraction with local base64/DataURI fallback.
 */

const uploadImage = async (fileBufferOrDataUri, options = {}) => {
  const hasCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY;

  if (hasCloudinary) {
    // Cloudinary SDK upload logic can be initialized here when keys exist in .env
  }

  // Fallback: If it's already a Data URI or URL, return it directly
  if (typeof fileBufferOrDataUri === 'string') {
    return fileBufferOrDataUri;
  }

  if (Buffer.isBuffer(fileBufferOrDataUri)) {
    const mimeType = options.mimeType || 'image/png';
    return `data:${mimeType};base64,${fileBufferOrDataUri.toString('base64')}`;
  }

  return fileBufferOrDataUri;
};

module.exports = { uploadImage };
