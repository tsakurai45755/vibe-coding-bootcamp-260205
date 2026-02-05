/**
 * API service for communicating with the backend.
 */
import { GenerateResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 60000; // 60 seconds

/**
 * Check backend health status.
 * 
 * @returns Health status
 * @throws Error if health check fails
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/healthz`);
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  
  return response.json();
}

/**
 * Generate daily report from screenshot image.
 * 
 * @param imageFile - Screenshot image file
 * @returns Generated markdown report
 * @throws Error if generation fails
 */
export async function generateDailyReport(imageFile: File): Promise<GenerateResponse> {
  // Create FormData
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      // Handle error response
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('リクエストがタイムアウトしました。しばらく待ってから再試行してください。');
      }
      throw error;
    }
    
    throw new Error('日報生成中に予期しないエラーが発生しました。');
  }
}
