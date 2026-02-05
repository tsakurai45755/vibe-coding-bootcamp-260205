import React from 'react'

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>日報アプリ</h1>
        <p style={styles.subtitle}>毎日の業務を記録しましょう</p>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>
          <p style={styles.message}>
            フロントエンドプロジェクトが正常に作成されました 🎉
          </p>
          <p style={styles.info}>
            React 18 + TypeScript + Vite で開発を始められます
          </p>
        </div>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0078d4',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 600,
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '1.125rem',
    opacity: 0.9,
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    textAlign: 'center',
  },
  message: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '1rem',
  },
  info: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
}

export default App
