/**
 * Export utilities for downloading Markdown files.
 */

/**
 * Generate filename for exported Markdown file.
 * Format: daily-report-YYYYMMDD-HHmm.md
 * 
 * @returns Generated filename
 */
export function generateFilename(): string {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `daily-report-${year}${month}${day}-${hours}${minutes}.md`;
}

/**
 * Export Markdown content as a file download.
 * 
 * @param markdown - Markdown content to export
 * @param filename - Optional custom filename (defaults to auto-generated)
 */
export function exportAsMarkdown(markdown: string, filename?: string): void {
  // Create blob with Markdown content
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || generateFilename();
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
