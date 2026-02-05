import React, { useCallback, useRef, useState } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  error: string | null;
}

/**
 * ImageUploader Component
 * 
 * ドラッグ&ドロップ、クリップボード貼り付け、ファイル選択による画像アップロード機能を提供します。
 * アクセシビリティとユーザビリティを考慮した実装になっています。
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルバリデーション
  const validateFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('対応している画像形式: JPEG, PNG, GIF, WebP');
      return false;
    }

    if (file.size > maxSize) {
      alert('ファイルサイズは10MB以下にしてください');
      return false;
    }

    return true;
  }, []);

  // ファイル処理
  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  }, [validateFile, onImageSelect]);

  // ドラッグ&ドロップハンドラー
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  // ファイル選択ハンドラー
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  // クリップボード貼り付けハンドラー
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleFile(file);
        }
        break;
      }
    }
  }, [handleFile]);

  // ファイル選択ボタンのクリックハンドラー
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // キーボードサポート（Enter/Spaceでファイル選択）
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleButtonClick();
    }
  }, [handleButtonClick]);

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        role="button"
        aria-label="画像をアップロード"
        aria-describedby="upload-instructions"
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="file-input"
          aria-label="ファイル選択"
        />
        
        <div className="upload-content">
          <svg
            className="upload-icon"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <h3 className="upload-title">画像をアップロード</h3>
          
          <p id="upload-instructions" className="upload-instructions">
            ドラッグ&ドロップ、クリップボード貼り付け（Ctrl+V / Cmd+V）、<br />
            またはクリックしてファイルを選択
          </p>

          <button
            type="button"
            className="select-file-button"
            onClick={handleButtonClick}
            aria-label="ファイルを選択"
          >
            ファイルを選択
          </button>

          <p className="file-info">
            対応形式: JPEG, PNG, GIF, WebP（最大10MB）
          </p>
        </div>
      </div>

      {error && (
        <div className="upload-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};
