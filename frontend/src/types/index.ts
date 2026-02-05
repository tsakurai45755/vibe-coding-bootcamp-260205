/**
 * TypeScript type definitions for the Daily Report Generator application.
 */

/**
 * Image state management
 */
export interface ImageState {
  file: File | null;
  preview: string | null;
  isValid: boolean;
  error: string | null;
}

/**
 * Generation state management
 */
export interface GenerationState {
  isLoading: boolean;
  markdown: string | null;
  error: string | null;
}

/**
 * API response for daily report generation
 */
export interface GenerateResponse {
  markdown: string;
}

/**
 * API error response
 */
export interface ErrorResponse {
  detail: string;
}

/**
 * Supported image MIME types
 */
export type SupportedImageType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';

/**
 * Image validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}
