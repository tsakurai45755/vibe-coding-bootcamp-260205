import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import './App.css'

type ApiSuccess = {
  report_markdown: string
  model: string
  processing_ms?: number | null
}

type ApiError = {
  code: string
  message: string
  detail?: string | null
}

const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024
const DEFAULT_REQUEST_TIMEOUT_MS = 60_000

function getEnvNumber(key: string): number | null {
  const value = import.meta.env[key]
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL
  if (typeof value === 'string' && value.trim() !== '') return value
  return 'http://localhost:8000'
}

function formatTimestampForFilename(now: Date): string {
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${yyyy}${mm}${dd}-${hh}${min}`
}

function isAcceptedMimeType(mimeType: string): boolean {
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(mimeType)
}

function extractFirstFile(dt: DataTransfer): File | null {
  const files = Array.from(dt.files ?? [])
  return files[0] ?? null
}

function extractFileFromClipboard(dt: DataTransfer): File | null {
  const items = Array.from(dt.items ?? [])
  for (const item of items) {
    if (item.kind !== 'file') continue
    const file = item.getAsFile()
    if (!file) continue
    return file
  }
  return null
}

export default function App() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])
  const maxImageBytes = useMemo(
    () => getEnvNumber('VITE_MAX_IMAGE_BYTES') ?? DEFAULT_MAX_IMAGE_BYTES,
    [],
  )
  const requestTimeoutMs = useMemo(
    () => getEnvNumber('VITE_REQUEST_TIMEOUT_MS') ?? DEFAULT_REQUEST_TIMEOUT_MS,
    [],
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reportMarkdown, setReportMarkdown] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const acceptText = useMemo(
    () => ACCEPTED_MIME_TYPES.map((x) => x.replace('image/', '')).join(', '),
    [],
  )

  function resetAll() {
    setErrorMessage(null)
    setImageFile(null)
    setReportMarkdown('')
  }

  function validateAndSetFile(file: File) {
    setErrorMessage(null)

    if (!isAcceptedMimeType(file.type)) {
      setImageFile(null)
      setReportMarkdown('')
      setErrorMessage(
        '画像ファイルが不正です。PNG/JPEG/WebPの画像を選択してください。',
      )
      return
    }
    if (file.size > maxImageBytes) {
      setImageFile(null)
      setReportMarkdown('')
      setErrorMessage(
        '画像サイズが上限を超えています。サイズを小さくして再試行してください。',
      )
      return
    }

    setImageFile(file)
  }

  function onPickFileClick() {
    fileInputRef.current?.click()
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    validateAndSetFile(file)
    e.target.value = ''
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const file = extractFirstFile(e.dataTransfer)
    if (!file) return
    validateAndSetFile(file)
  }

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const target = e.target as HTMLElement | null
      const tagName = target?.tagName?.toLowerCase()
      if (tagName === 'textarea' || tagName === 'input') return

      const dt = e.clipboardData
      if (!dt) return
      const file = extractFileFromClipboard(dt)
      if (!file) return

      validateAndSetFile(file)
    }

    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxImageBytes])

  async function onGenerateClick() {
    if (!imageFile) return

    setErrorMessage(null)
    setIsGenerating(true)

    const form = new FormData()
    form.append('image', imageFile)

    const controller = new AbortController()
    const timerId = window.setTimeout(() => controller.abort(), requestTimeoutMs)

    try {
      const res = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        body: form,
        signal: controller.signal,
      })

      if (!res.ok) {
        let message = '生成に失敗しました。時間をおいて再試行してください。'

        try {
          const json = (await res.json()) as ApiError
          if (typeof json?.message === 'string' && json.message.trim() !== '') {
            message = json.message
          }
        } catch {
          // ignore
        }

        if (res.status === 504) {
          setErrorMessage(
            '生成がタイムアウトしました。時間をおいて再試行してください。',
          )
        } else {
          setErrorMessage(message)
        }
        return
      }

      const json = (await res.json()) as ApiSuccess
      setReportMarkdown(json.report_markdown ?? '')
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setErrorMessage(
          '生成がタイムアウトしました。時間をおいて再試行してください。',
        )
        return
      }
      setErrorMessage('通信に失敗しました。時間をおいて再試行してください。')
    } finally {
      window.clearTimeout(timerId)
      setIsGenerating(false)
    }
  }

  async function onCopyClick() {
    setErrorMessage(null)
    try {
      await navigator.clipboard.writeText(reportMarkdown)
    } catch {
      setErrorMessage(
        'コピーに失敗しました。ブラウザの権限設定を確認してください。',
      )
    }
  }

  function onExportClick() {
    setErrorMessage(null)

    const filename = `daily-report-${formatTimestampForFilename(new Date())}.md`
    const blob = new Blob([reportMarkdown], {
      type: 'text/markdown;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">日報ジェネレーター（MVP）</h1>
      </header>

      <main className="main">
        <section className="panel" aria-label="画像入力">
          <div className="panelHeader">
            <h2 className="panelTitle">1) 画像を入力</h2>
          </div>

          <div
            className="dropzone"
            onDrop={onDrop}
            onDragOver={onDragOver}
            role="group"
            aria-label="画像をドラッグ&ドロップ、または貼り付け"
          >
            <p className="dropzoneText">
              ドラッグ&ドロップ、またはクリップボード貼り付けで画像を入力できます。
            </p>
            <p className="dropzoneHint">
              対応形式: {acceptText} / 上限:{' '}
              {Math.floor(maxImageBytes / 1024 / 1024)}MB
            </p>

            <div className="row">
              <input
                ref={fileInputRef}
                className="fileInput"
                type="file"
                accept={ACCEPTED_MIME_TYPES.join(',')}
                onChange={onFileInputChange}
              />
              <button type="button" onClick={onPickFileClick}>
                ファイルを選択
              </button>
              <button
                type="button"
                onClick={resetAll}
                disabled={!imageFile && reportMarkdown === ''}
              >
                クリア
              </button>
            </div>
          </div>

          {imagePreviewUrl ? (
            <figure className="preview">
              <img
                className="previewImg"
                src={imagePreviewUrl}
                alt="入力画像のプレビュー"
              />
            </figure>
          ) : null}

          <div className="row">
            <button
              type="button"
              onClick={onGenerateClick}
              disabled={!imageFile || isGenerating}
            >
              {isGenerating ? '生成中…' : '生成'}
            </button>
          </div>
        </section>

        <section className="panel" aria-label="生成結果">
          <div className="panelHeader">
            <h2 className="panelTitle">2) 生成結果（Markdown）</h2>
          </div>

          {errorMessage ? (
            <div className="error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <label className="field">
            <span className="fieldLabel">テキスト</span>
            <textarea
              className="textarea"
              value={reportMarkdown}
              onChange={(e) => setReportMarkdown(e.target.value)}
              placeholder={'## 作業内容\n\n## 進捗状況\n\n## 課題・問題点\n'}
              rows={16}
              spellCheck={false}
            />
          </label>

          <div className="row">
            <button
              type="button"
              onClick={onCopyClick}
              disabled={reportMarkdown.trim() === ''}
            >
              コピー
            </button>
            <button
              type="button"
              onClick={onExportClick}
              disabled={reportMarkdown.trim() === ''}
            >
              エクスポート（.md）
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
