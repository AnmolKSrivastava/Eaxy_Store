import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';
import { compressAndConvertToWebP } from '../utils/imageCompression';

/**
 * Upload product image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export async function uploadProductImage(file, onProgress = null) {
  try {
    // Compress and convert to WebP
    const webpBlob = await compressAndConvertToWebP(file);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `products/${timestamp}_${randomString}.webp`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, webpBlob, {
      contentType: 'image/webp',
    });
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          // Handle upload errors
          console.error('Upload error:', error);
          reject(new Error('Failed to upload image: ' + error.message));
        },
        async () => {
          // Upload completed successfully, get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(new Error('Failed to get download URL: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    throw new Error('Image processing failed: ' + error.message);
  }
}

/**
 * Upload category image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export async function uploadCategoryImage(file, onProgress = null) {
  try {
    // Compress and convert to WebP
    const webpBlob = await compressAndConvertToWebP(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.85,
    });
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `categories/${timestamp}_${randomString}.webp`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, webpBlob, {
      contentType: 'image/webp',
    });
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error('Failed to upload image: ' + error.message));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(new Error('Failed to get download URL: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    throw new Error('Image processing failed: ' + error.message);
  }
}

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - The download URL of the image to delete
 * @returns {Promise<void>}
 */
export async function deleteImage(imageUrl) {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathStartIndex = url.pathname.indexOf('/o/') + 3;
    const pathEndIndex = url.pathname.indexOf('?');
    const path = decodeURIComponent(
      url.pathname.substring(pathStartIndex, pathEndIndex !== -1 ? pathEndIndex : undefined)
    );
    
    // Create reference and delete
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Failed to delete image:', error);
    // Don't throw error - image might already be deleted or URL might be external
  }
}

/**
 * Replace existing image with new one
 * @param {string} oldImageUrl - URL of image to replace
 * @param {File} newFile - New image file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} - Download URL of new image
 */
export async function replaceProductImage(oldImageUrl, newFile, onProgress = null) {
  try {
    // Upload new image first
    const newImageUrl = await uploadProductImage(newFile, onProgress);
    
    // Delete old image (if it exists and is from Firebase Storage)
    if (oldImageUrl && oldImageUrl.includes('firebasestorage.googleapis.com')) {
      await deleteImage(oldImageUrl);
    }
    
    return newImageUrl;
  } catch (error) {
    throw new Error('Failed to replace image: ' + error.message);
  }
}

/**
 * Upload multiple product images to Firebase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {Function} onProgress - Progress callback (percentage, current, total)
 * @returns {Promise<string[]>} - Array of download URLs
 */
export async function uploadMultipleProductImages(files, onProgress = null) {
  const uploadPromises = files.map((file, index) => {
    return uploadProductImage(file, (progress) => {
      if (onProgress) {
        // Calculate overall progress
        const overallProgress = ((index * 100 + progress) / files.length);
        onProgress(Math.round(overallProgress), index + 1, files.length);
      }
    });
  });
  
  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw new Error('Failed to upload images: ' + error.message);
  }
}

/**
 * Delete multiple images from Firebase Storage
 * @param {string[]} imageUrls - Array of image URLs to delete
 * @returns {Promise<void>}
 */
export async function deleteMultipleImages(imageUrls) {
  const deletePromises = imageUrls
    .filter(url => url && url.includes('firebasestorage.googleapis.com'))
    .map(url => deleteImage(url));
  
  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Failed to delete some images:', error);
    // Don't throw - partial deletion is acceptable
  }
}
