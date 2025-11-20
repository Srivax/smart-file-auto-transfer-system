import React from 'react'
import UploadForm from './components/UploadForm.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>Smart File AutoTransfer System</h1>
      <p>Upload Excel and view API response</p>
      <ErrorBoundary>
        <UploadForm />
      </ErrorBoundary>
    </div>
  )
}
