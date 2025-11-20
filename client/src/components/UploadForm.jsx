import React, { useState } from 'react'
import axios from 'axios'
import { logClientError } from '../utils/logger.js'

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSelect = (e) => setFile(e.target.files?.[0] || null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return alert('Choose an .xlsx file first')

    const form = new FormData()
    form.append('file', file)

    try {
      setLoading(true)
      const { data } = await axios.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)
    } catch (err) {
      logClientError('Upload failed', { message: err?.message })
      alert(err?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".xlsx" onChange={onSelect} />
        <button type="submit" style={{ marginLeft: 12 }} disabled={loading}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>
      {result && (
        <pre style={{ background: '#f7f7f8', padding: 12, borderRadius: 8, marginTop: 16 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
