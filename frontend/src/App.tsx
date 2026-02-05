import React, { useState, useCallback } from 'react';
import {
  ImageUploader,
  ImagePreview,
  GenerateButton,
  LoadingSpinner,
  MarkdownEditor,
  ErrorMessage,
  ActionButtons,
} from './components';
import { generateDailyReport } from './services/api';
import { createPreviewUrl, revokePreviewUrl } from './utils/fileValidation';
import { exportAsMarkdown } from './utils/exportMarkdown';
import './App.css';

const App: React.FC = () => {
  // State management
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle image selection
  const handleImageSelect = useCallback((file: File) => {
    // Cleanup previous preview
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
    }

    // Set new image
    setImageFile(file);
    setPreviewUrl(createPreviewUrl(file));
    setUploadError(null);
    setError(null);
    setMarkdown(''); // Reset markdown when new image is selected
  }, [previewUrl]);

  // Handle image removal
  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setError(null);
    setMarkdown('');
  }, [previewUrl]);

  // Handle generation
  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError('画像が選択されていません。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateDailyReport(imageFile);
      setMarkdown(response.markdown);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('日報生成中にエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  // Handle copy
  const handleCopy = useCallback(() => {
    // Feedback will be handled by ActionButtons component
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    exportAsMarkdown(markdown);
  }, [markdown]);

  // Handle markdown change
  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 日報自動生成アプリ</h1>
        <p className="app-subtitle">
          スクリーンショットから簡単に日報を生成
        </p>
      </header>

      <main className="app-main">
        {/* Image Upload Section */}
        <section className="section">
          <h2>1. 画像をアップロード</h2>
          <ImageUploader onImageSelect={handleImageSelect} error={uploadError} />
          <ImagePreview previewUrl={previewUrl} onRemove={handleRemoveImage} />
        </section>

        {/* Generate Section */}
        <section className="section">
          <h2>2. 日報を生成</h2>
          <GenerateButton
            onClick={handleGenerate}
            disabled={!imageFile || isLoading}
            isLoading={isLoading}
          />
        </section>

        {/* Error Display */}
        <ErrorMessage message={error} />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-container">
            <LoadingSpinner />
            <p className="loading-text">日報を生成中...</p>
          </div>
        )}

        {/* Markdown Editor Section */}
        {!isLoading && markdown && (
          <>
            <section className="section">
              <h2>3. 日報を編集</h2>
              <MarkdownEditor value={markdown} onChange={handleMarkdownChange} />
            </section>

            {/* Action Buttons Section */}
            <section className="section">
              <h2>4. 保存</h2>
              <ActionButtons
                markdown={markdown}
                onCopy={handleCopy}
                onExport={handleExport}
              />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Azure OpenAI GPT-4.1</p>
      </footer>
    </div>
  );
};

export default App;
