/**
 * File validation utilities for image uploads.
 */
import { SupportedImageType, ValidationResult } from '../types';

const SUPPORTED_TYPES: SupportedImageType[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate uploaded image file.
 * 
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!SUPPORTED_TYPES.includes(file.type as SupportedImageType)) {
    return {
      isValid: false,
      error: 'サポートされていない画像形式です。PNG, JPEG, WEBPのみサポートしています。'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `画像サイズが上限（${MAX_FILE_SIZE / 1024 / 1024}MB）を超えています。`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Create object URL for image preview.
 * 
 * @param file - Image file
 * @returns Object URL for preview
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory.
 * 
 * @param url - Object URL to revoke
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
