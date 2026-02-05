import React from 'react';
import './GenerateButton.css';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

/**
 * GenerateButton Component
 * 
 * 日報生成ボタンコンポーネント。
 * ローディング状態とdisabled状態を視覚的に表現し、アクセシビリティに配慮しています。
 */
export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled,
  isLoading,
}) => {
  return (
    <button
      type="button"
      className={`generate-button ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={isLoading ? '日報を生成中' : '日報を生成'}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="button-spinner" aria-hidden="true">
            <svg
              className="spinner-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
          <span className="button-text">生成中...</span>
        </>
      ) : (
        <>
          <span className="button-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </span>
          <span className="button-text">日報を生成</span>
        </>
      )}
    </button>
  );
};
