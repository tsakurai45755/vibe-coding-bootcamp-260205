import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string | null;
}

/**
 * ErrorMessage Component
 * 
 * エラーメッセージを視覚的に表示するコンポーネント。
 * アクセシビリティに配慮し、適切なARIA属性を使用しています。
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="error-message"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="error-content">
        <div className="error-icon" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <div className="error-text">
          <h4 className="error-title">エラーが発生しました</h4>
          <p className="error-description">{message}</p>
        </div>
      </div>

      {/* 装飾的な要素 */}
      <div className="error-decoration" aria-hidden="true">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-circle decoration-circle-3"></div>
      </div>
    </div>
  );
};
