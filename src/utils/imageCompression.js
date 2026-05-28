/**
 * Image Compression & WebP Conversion Utility
 * Accepts: JPEG, PNG, WebP
 * Output: Compressed WebP format
 * Max dimensions: 1200x1200px
 * Quality: 85%
 */

/**
 * Compress and convert image to WebP format
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} - Compressed WebP blob
 */
export async function compressAndConvertToWebP(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      reject(new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.'));
      return;
    }

    // Validate file size (max 10MB before compression)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      reject(new Error('File size too large. Please upload images smaller than 10MB.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image.'));
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Generate thumbnail version of image
 * @param {File} file - The image file
 * @returns {Promise<Blob>} - Thumbnail WebP blob (150x150px)
 */
export async function generateThumbnail(file) {
  return compressAndConvertToWebP(file, {
    maxWidth: 150,
    maxHeight: 150,
    quality: 0.8,
  });
}

/**
 * Validate image file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result { valid: boolean, error: string }
 */
export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' 
    };
  }

  if (file.size > maxFileSize) {
    return { 
      valid: false, 
      error: 'File size too large. Please upload images smaller than 10MB.' 
    };
  }

  return { valid: true, error: null };
}

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
