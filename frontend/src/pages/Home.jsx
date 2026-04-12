import { useState }      from 'react'
import InputPanel        from '../components/InputPanel'
import ResultsPanel      from '../components/ResultsPanel'
import ImageAnalyzer     from '../components/ImageAnalyzer'
import { analyzeContent } from '../services/api'

export default function Home() {
  const [tab,          setTab]          = useState('text')
  const [loading,      setLoading]      = useState(false)
  const [results,      setResults]      = useState(null)
  const [error,        setError]        = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')

  const handleAnalyze = async (text) => {
    setLoading(true); setError(null); setResults(null); setAnalyzedText(text)
    try       { setResults(await analyzeContent(text)) }
    catch     { setError('Cannot reach backend. Make sure FastAPI is running on port 8000.') }
    finally   { setLoading(false) }
  }

  const TABS = [
    { id:'text',  icon:'≋', label:'Text Analysis'  },
    { id:'image', icon:'◎', label:'Image Detection' },
  ]

  return (
    <>
      <div className="orb float" style={{ width:600, height:600, top:-200, left:'50%', transform:'translateX(-50%)', background:'radial-gradient(circle, rgba(232,201,126,0.07) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width:400, height:400, bottom:100, right:-100, background:'radial-gradient(circle, rgba(79,255,176,0.05) 0%, transparent 70%)', animation:'floatOrb 16s ease-in-out infinite reverse' }} />

      <main style={{ position:'relative', zIndex:10, maxWidth:900, margin:'0 auto', padding:'80px 24px 120px' }}>

        {/* Hero */}
        <div className="fade-up" style={{ textAlign:'center', marginBottom:60 }}>
          <h1 style={{ fontFamily:'var(--ff-display)', fontSize:72, fontWeight:800, lineHeight:1.05,
            color:'var(--text1)', letterSpacing:'-0.02em', marginBottom:20 }}>
            Does the internet<br />
            <span style={{ color:'var(--gold)' }}>trust this content?</span>
          </h1>
          <p style={{ fontFamily:'var(--ff-body)', fontSize:18, color:'var(--text2)', maxWidth:520, margin:'0 auto', lineHeight:1.8 }}>
            Instantly detect AI authorship, check for fake news signals, and track how content has spread across the web.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="fade-up d1" style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:100, padding:4 }}>
            {TABS.map(({ id, icon, label }) => {
              const active = tab === id
              return (
                <button key={id} onClick={() => { setTab(id); setResults(null); setError(null) }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 28px', borderRadius:100,
                    fontFamily:'var(--ff-display)', fontSize:14, fontWeight: active ? 600 : 400,
                    color: active ? 'var(--ink)' : 'var(--text2)',
                    background: active ? 'var(--gold)' : 'transparent',
                    border:'none', cursor:'pointer', transition:'all 0.25s',
                    boxShadow: active ? '0 0 20px rgba(232,201,126,0.25)' : 'none',
                    letterSpacing:'0.02em' }}>
                  <span style={{ fontSize:16 }}>{icon}</span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="fade-up d2">
          {tab === 'text' ? (
            <>
              <InputPanel onAnalyze={handleAnalyze} loading={loading} />
              {error && (
                <div style={{ marginTop:24, padding:'14px 20px', borderRadius:12,
                  background:'rgba(255,107,138,0.07)', border:'1px solid rgba(255,107,138,0.2)',
                  fontFamily:'var(--ff-mono)', fontSize:12, color:'var(--rose)' }}>
                  ✕ {error}
                </div>
              )}
              {results && <div style={{ marginTop:40 }}><ResultsPanel data={results} originalText={analyzedText} /></div>}
            </>
          ) : (
            <ImageAnalyzer />
          )}
        </div>

        {/* Features grid */}
        {!results && !loading && tab === 'text' && (
          <div className="fade-up d3" style={{ marginTop:100 }}>
            <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)', marginBottom:40 }} />
            <p style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)', letterSpacing:'0.14em', textTransform:'uppercase', textAlign:'center', marginBottom:32 }}>
              What Veritrace Analyzes
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
              {[
                { icon:'◎', title:'AI Detection',    desc:'Probability score for AI vs human authorship using local ML model' },
                { icon:'⚑', title:'Fake News',       desc:'Linguistic pattern analysis for misinformation signals and sensationalism' },
                { icon:'◈', title:'Web Propagation', desc:'Track where content appears and how it spread across platforms' },
                { icon:'≋', title:'Similarity',      desc:'Cosine similarity matching against all found web sources' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card" style={{ padding:22 }}>
                  <div style={{ fontFamily:'var(--ff-display)', fontSize:24, color:'var(--gold)', marginBottom:14 }}>{icon}</div>
                  <div style={{ fontFamily:'var(--ff-display)', fontSize:15, fontWeight:600, color:'var(--text1)', marginBottom:8 }}>{title}</div>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:12, color:'var(--text2)', lineHeight:1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}