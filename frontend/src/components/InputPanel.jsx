import { useState } from 'react'

const EXAMPLES = [
  'Scientists discover that drinking coffee reverses aging by 20 years, Big Pharma desperately trying to suppress this information.',
  'According to a new Reuters study, AI-generated content now accounts for 38% of all online articles published in 2024.',
  'BREAKING: Government secretly adding chemicals to tap water to control population — doctors REFUSE to talk about this!',
]

export default function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState('')
  const ready = text.trim().length >= 30
  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <section style={{ position:'relative', zIndex:10 }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6,
          fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--gold)',
          background:'rgba(232,201,126,0.08)', border:'1px solid rgba(232,201,126,0.2)',
          padding:'5px 14px', borderRadius:100, marginBottom:20, letterSpacing:'0.1em' }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--gold)', display:'block', animation:'pulse 2.4s ease-in-out infinite' }} />
          CONTENT ANALYSIS ENGINE
        </div>
        <h2 style={{ fontFamily:'var(--ff-display)', fontSize:42, fontWeight:700, color:'var(--text1)', lineHeight:1.15, marginBottom:14 }}>
          Paste any content.<br />
          <span style={{ color:'var(--gold)' }}>We'll tell you everything.</span>
        </h2>
        <p style={{ fontFamily:'var(--ff-body)', fontSize:16, color:'var(--text2)', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
          Articles, tweets, news headlines, social posts — analyze AI authorship, fake news signals, and web propagation in seconds.
        </p>
      </div>

      <div style={{ background:'var(--ink2)', border:'1px solid rgba(232,201,126,0.15)',
        borderRadius:24, overflow:'hidden',
        boxShadow:'0 0 80px rgba(232,201,126,0.05), 0 40px 80px rgba(0,0,0,0.4)',
        maxWidth:860, margin:'0 auto' }}>

        {/* Top bar */}
        <div style={{ padding:'14px 24px', borderBottom:'1px solid var(--rim)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'rgba(255,255,255,0.02)' }}>
          <div style={{ display:'flex', gap:8 }}>
            {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => (
              <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:c, opacity:0.7 }} />
            ))}
          </div>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)', letterSpacing:'0.1em' }}>
            VERITRACE — CONTENT ANALYZER v2.0
          </span>
          <div style={{ display:'flex', gap:12 }}>
            <span style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)' }}>{words}w</span>
            <span style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)' }}>{text.length}c</span>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste an article, news headline, tweet, or any text here..."
          style={{ width:'100%', minHeight:220, background:'transparent', border:'none',
            outline:'none', resize:'none', fontFamily:'var(--ff-body)', fontSize:16,
            color:'var(--text1)', lineHeight:1.8, padding:'28px 32px',
            caretColor:'var(--gold)' }}
        />

        {/* Example chips */}
        <div style={{ padding:'14px 24px', display:'flex', gap:8, alignItems:'center',
          flexWrap:'wrap', background:'rgba(0,0,0,0.15)', borderTop:'1px solid var(--rim)' }}>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', marginRight:4, letterSpacing:'0.08em' }}>
            EXAMPLES:
          </span>
          {['Fake news sample','Real news sample','Clickbait sample'].map((label, i) => (
            <button key={i} onClick={() => setText(EXAMPLES[i])} style={{
              fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text2)',
              background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)',
              borderRadius:100, padding:'4px 12px', cursor:'pointer', transition:'all 0.2s',
            }}
            onMouseEnter={e=>{ e.target.style.color='var(--gold)'; e.target.style.borderColor='rgba(232,201,126,0.3)' }}
            onMouseLeave={e=>{ e.target.style.color='var(--text2)'; e.target.style.borderColor='var(--rim)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--rim)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'rgba(255,255,255,0.01)' }}>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {['AI Detection','Fake News','Propagation','Similarity'].map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--emerald)', opacity:0.7 }} />
                <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', letterSpacing:'0.07em' }}>{f}</span>
              </div>
            ))}
          </div>

          <button onClick={() => ready && !loading && onAnalyze(text)} disabled={!ready || loading}
            style={{ display:'flex', alignItems:'center', gap:10,
              fontFamily:'var(--ff-display)', fontSize:14, fontWeight:600,
              padding:'11px 28px', borderRadius:100,
              background: ready ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: ready ? 'var(--ink)' : 'var(--text3)',
              border:'none', cursor: ready ? 'pointer' : 'not-allowed',
              transition:'all 0.3s', letterSpacing:'0.03em',
              boxShadow: ready ? '0 0 30px rgba(232,201,126,0.3)' : 'none' }}
            onMouseEnter={e=>{ if(ready && !loading) e.currentTarget.style.boxShadow='0 0 50px rgba(232,201,126,0.5)' }}
            onMouseLeave={e=>{ if(ready && !loading) e.currentTarget.style.boxShadow='0 0 30px rgba(232,201,126,0.3)' }}>
            {loading ? (
              <>
                <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Content
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {loading && (
          <div style={{ height:2, background:'rgba(255,255,255,0.04)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:'40%',
              background:'linear-gradient(90deg, transparent, var(--gold), transparent)',
              animation:'shimmer 1.4s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:24, flexWrap:'wrap' }}>
        {[
          { icon:'◎', label:'Real-time analysis' },
          { icon:'⊕', label:'No data stored' },
          { icon:'◈', label:'4 detection models' },
          { icon:'◇', label:'Free to use' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:7,
            padding:'6px 14px', borderRadius:100,
            background:'rgba(255,255,255,0.03)', border:'1px solid var(--rim)' }}>
            <span style={{ color:'var(--gold)', fontSize:12 }}>{icon}</span>
            <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', letterSpacing:'0.07em' }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}