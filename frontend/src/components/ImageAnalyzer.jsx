import { useState, useRef } from 'react'
import { analyzeImage }     from '../services/api'
import AIDetectionBadge     from './AIDetectionBadge'
import FakeNewsDetector     from './FakeNewsDetector'
import SimilarityCard       from './SimilarityCard'
import PropagationGraph     from './PropagationGraph'

export default function ImageAnalyzer() {
  const [file,     setFile]     = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP)')
      return
    }
    setFile(f)
    setResult(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      console.log('Uploading:', file.name, file.type, file.size)
      const data = await analyzeImage(file)
      console.log('Result:', data)
      setResult(data)
    } catch (err) {
      console.error('Error:', err)
      const msg = err.response?.data?.detail || err.message || 'Failed to analyze. Is the backend running on port 8000?'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  // ── UPLOAD SCREEN ──
  if (!preview) {
    return (
      <div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'rgba(232,201,126,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20,
            padding: '64px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(232,201,126,0.04)' : 'rgba(255,255,255,0.01)',
            transition: 'all 0.25s',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div style={{
            width: 68, height: 68, borderRadius: 18,
            margin: '0 auto 22px',
            background: 'rgba(232,201,126,0.08)',
            border: '1px solid rgba(232,201,126,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e8c97e" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>

          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
            Drop an image to analyze
          </div>
          <div style={{ fontFamily: 'var(--ff-body)', fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>
            AI detection · Fake news signals · Web propagation · Similarity scoring
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['JPG', 'PNG', 'WEBP', 'GIF', 'Max 10MB'].map((f) => (
              <span key={f} style={{
                fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
                padding: '3px 10px', borderRadius: 100,
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--rim)',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,107,138,0.07)', border: '1px solid rgba(255,107,138,0.2)',
            fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--rose)',
          }}>
            ✕ {error}
          </div>
        )}
      </div>
    )
  }

  // ── PREVIEW SCREEN ──
  if (preview && !result && !loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        <div className="card" style={{ padding: 16 }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%', borderRadius: 12, display: 'block',
              maxHeight: 300, objectFit: 'contain', background: 'rgba(0,0,0,0.3)',
            }}
          />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontFamily: 'var(--ff-body)', fontSize: 13, color: 'var(--text1)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180,
              }}>
                {file?.name}
              </div>
              <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                {(file?.size / 1024).toFixed(0)} KB · {file?.type?.split('/')[1]?.toUpperCase()}
              </div>
            </div>
            <button
              onClick={reset}
              style={{
                fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
                background: 'transparent', border: '1px solid var(--rim)',
                borderRadius: 100, padding: '4px 12px', cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{
              fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14,
            }}>
              Analysis Pipeline
            </div>
            {[
              { icon: '◎', label: 'AI generation probability score',        color: 'var(--rose)'    },
              { icon: '⚑', label: 'Fake news and manipulation signals',     color: '#f5a623'        },
              { icon: '◈', label: 'Reverse image search propagation graph', color: 'var(--sky)'     },
              { icon: '≋', label: 'Web similarity matching across sources', color: 'var(--emerald)' },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ color, fontSize: 14, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontFamily: 'var(--ff-body)', fontSize: 13, color: 'var(--text2)' }}>{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px', borderRadius: 100,
              fontFamily: 'var(--ff-display)', fontSize: 15, fontWeight: 600,
              background: 'var(--gold)', color: 'var(--ink)',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(232,201,126,0.3)',
              transition: 'all 0.3s', letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 50px rgba(232,201,126,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(232,201,126,0.3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Run Full Analysis
          </button>
        </div>
      </div>
    )
  }

  // ── LOADING SCREEN ──
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <svg
          style={{ animation: 'spin 1s linear infinite', marginBottom: 20 }}
          width="40" height="40" viewBox="0 0 24 24" fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(232,201,126,0.2)" strokeWidth="2"/>
          <path d="M12 2a10 10 0 0110 10" stroke="#e8c97e" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div style={{
          fontFamily: 'var(--ff-display)', fontSize: 18, fontWeight: 600,
          color: 'var(--text1)', marginBottom: 20,
        }}>
          Analyzing image...
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280, margin: '0 auto' }}>
          {[
            'Running AI detection model',
            'Analyzing fake news signals',
            'Searching web for image propagation',
            'Computing similarity scores',
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text3)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--gold)', display: 'block', flexShrink: 0,
                animation: 'pulse 2.4s ease-in-out infinite',
                animationDelay: `${i * 0.3}s`,
              }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── RESULTS SCREEN ──
  if (result) {
    const ai      = result.ai_detection || {}
    const isAI    = ai.is_ai_generated
    const vc      = isAI ? 'var(--rose)'               : 'var(--emerald)'
    const vbg     = isAI ? 'rgba(255,107,138,0.08)'    : 'rgba(79,255,176,0.08)'
    const vborder = isAI ? 'rgba(255,107,138,0.25)'    : 'rgba(79,255,176,0.25)'

    const aiDetectionData = {
      is_ai_generated:   ai.is_ai_generated,
      ai_probability:    ai.ai_probability,
      human_probability: ai.human_probability,
      label:             ai.label,
      confidence:        ai.confidence,
      note:              result.propagation?.note || null,
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

        {/* Verdict header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'center',
          padding: '20px 24px', borderRadius: 20, background: vbg, border: `1px solid ${vborder}`,
        }}>
          <img
            src={preview} alt="analyzed"
            style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 12, border: `1px solid ${vborder}` }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              Analysis Complete
            </div>
            <div style={{
              fontFamily: 'var(--ff-display)', fontSize: 32, fontWeight: 800,
              color: vc, lineHeight: 1, marginBottom: 8,
            }}>
              {ai.label}
            </div>
            <div style={{
              fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text2)',
              letterSpacing: '0.06em', marginBottom: 16,
            }}>
              {ai.confidence} confidence · {ai.width}x{ai.height}px · {file?.name}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'AI Score',   value: `${ai.ai_percent}%`,           color: 'var(--rose)' },
                { label: 'Fake Score', value: `${result.fake_news?.score}%`, color: '#f5a623'     },
                { label: 'Sources',    value: result.similarity?.length ?? 0, color: 'var(--sky)'  },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  padding: '8px 16px', borderRadius: 100,
                  background: 'rgba(0,0,0,0.2)', border: `1px solid ${color}30`,
                }}>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)' }}>{label}: </span>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: 14, fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <span style={{
            fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--gold)',
            background: 'rgba(232,201,126,0.08)', border: '1px solid rgba(232,201,126,0.2)',
            padding: '4px 14px', borderRadius: 100, letterSpacing: '0.1em',
          }}>
            Detailed Results
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* AI + Fake News side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <AIDetectionBadge data={aiDetectionData} />
          <FakeNewsDetector data={result.fake_news} />
        </div>

        {/* Image signals */}
        {ai.signals?.length > 0 && (
          <div className="card" style={{ padding: 24 }}>
            <span style={{
              fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--rim)',
              padding: '3px 12px', borderRadius: 100, display: 'inline-block', marginBottom: 16,
            }}>
              Image Signals
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ai.signals.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: 'rgba(232,201,126,0.08)', border: '1px solid rgba(232,201,126,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--gold)',
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontFamily: 'var(--ff-body)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <PropagationGraph results={result.similarity} originalText="" isImage={true} />
        <SimilarityCard   results={result.similarity} />

        <button
          onClick={reset}
          style={{
            padding: '11px', borderRadius: 100, background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text2)',
            fontFamily: 'var(--ff-mono)', fontSize: 12, cursor: 'pointer',
            letterSpacing: '0.05em', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(232,201,126,0.25)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text2)' }}
        >
          ← Analyze Another Image
        </button>
      </div>
    )
  }

  return null
}