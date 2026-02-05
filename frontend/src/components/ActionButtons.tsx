import React, { useCallback, useState } from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  markdown: string;
  onCopy: () => void;
  onExport: () => void;
}

/**
 * ActionButtons Component
 * 
 * コピーボタンとエクスポートボタンを提供するコンポーネント。
 * Clipboard APIを使用し、ユーザーフィードバックとアクセシビリティに配慮しています。
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  markdown,
  onCopy,
  onExport,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // クリップボードにコピー
  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdown);
        setCopySuccess(true);
        onCopy();

        // 2秒後にリセット
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      } else {
        // フォールバック: 古いブラウザ用
        const textArea = document.createElement('textarea');
        textArea.value = markdown;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopySuccess(true);
          onCopy();
          
          setTimeout(() => {
            setCopySuccess(false);
          }, 2000);
        } catch (err) {
          console.error('コピーに失敗しました:', err);
          alert('コピーに失敗しました。手動でテキストを選択してコピーしてください。');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      alert('コピーに失敗しました。もう一度お試しください。');
    }
  }, [markdown, onCopy]);

  const handleExport = useCallback(() => {
    onExport();
  }, [onExport]);

  const isDisabled = !markdown || markdown.trim().length === 0;

  return (
    <div className="action-buttons" role="group" aria-label="日報アクション">
      <button
        type="button"
        className={`action-button copy-button ${copySuccess ? 'success' : ''}`}
        onClick={handleCopy}
        disabled={isDisabled}
        aria-label={copySuccess ? 'コピー完了' : 'クリップボードにコピー'}
        title={copySuccess ? 'コピー完了' : 'クリップボードにコピー'}
      >
        {copySuccess ? (
          <>
            <svg
              className="button-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="button-label">コピー完了</span>
          </>
        ) : (
          <>
            <svg
              className="button-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="button-label">コピー</span>
          </>
        )}
      </button>

      <button
        type="button"
        className="action-button export-button"
        onClick={handleExport}
        disabled={isDisabled}
        aria-label="Markdownファイルとしてエクスポート"
        title="Markdownファイルとしてエクスポート"
      >
        <svg
          className="button-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="button-label">エクスポート</span>
      </button>
    </div>
  );
};
