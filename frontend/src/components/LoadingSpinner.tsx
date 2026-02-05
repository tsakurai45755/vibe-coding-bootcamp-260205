import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * 
 * ローディング中を示すアニメーション付きスピナーコンポーネント。
 * アクセシビリティに配慮したARIA属性を含んでいます。
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div 
      className="loading-spinner-container"
      role="status"
      aria-live="polite"
      aria-label="読み込み中"
    >
      <div className="loading-spinner">
        <div className="spinner-ring" aria-hidden="true">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <div className="spinner-icon" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      </div>
      
      <p className="loading-text">
        AIが日報を生成しています...
      </p>
      
      <div className="loading-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* スクリーンリーダー用のテキスト */}
      <span className="sr-only">
        日報を生成中です。しばらくお待ちください。
      </span>
    </div>
  );
};
