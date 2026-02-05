import React, { useCallback } from 'react';
import './ImagePreview.css';

interface ImagePreviewProps {
  previewUrl: string | null;
  onRemove: () => void;
}

/**
 * ImagePreview Component
 * 
 * アップロードされた画像のプレビューを表示し、削除機能を提供します。
 * アクセシビリティとキーボード操作に対応しています。
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, onRemove }) => {
  // キーボードサポート（Enter/Spaceで削除）
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRemove();
    }
  }, [onRemove]);

  if (!previewUrl) {
    return null;
  }

  return (
    <div className="image-preview" role="region" aria-label="画像プレビュー">
      <div className="preview-container">
        <img
          src={previewUrl}
          alt="アップロードされた画像のプレビュー"
          className="preview-image"
        />
        
        <button
          type="button"
          className="remove-button"
          onClick={onRemove}
          onKeyDown={handleKeyDown}
          aria-label="画像を削除"
          title="画像を削除"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>

        <div className="preview-overlay">
          <div className="preview-info">
            <svg
              className="check-icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="preview-text">アップロード完了</span>
          </div>
        </div>
      </div>
    </div>
  );
};
