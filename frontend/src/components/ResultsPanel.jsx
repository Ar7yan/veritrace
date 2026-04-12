import AIDetectionBadge from './AIDetectionBadge'
import FakeNewsDetector from './FakeNewsDetector'
import SimilarityCard   from './SimilarityCard'
import PropagationGraph from './PropagationGraph'

export default function ResultsPanel({ data, originalText = '' }) {
  if (!data) return null
  const ai    = Math.round((data.ai_detection?.ai_probability || 0) * 100)
  const fake  = data.fake_news?.score ?? 0
  const found = data.similarity?.length ?? 0

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, margin:'12px 0' }}>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.05)' }} />
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--gold)',
          background:'rgba(232,201,126,0.08)', border:'1px solid rgba(232,201,126,0.2)',
          padding:'4px 14px', borderRadius:100, letterSpacing:'0.1em' }}>
          Analysis Results
        </span>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.05)' }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          { label:'AI Probability',  value:`${ai}%`,  color:'var(--rose)',  sub:'of content is AI-generated' },
          { label:'Sources Found',   value:found,      color:'var(--sky)',   sub:'web matches detected'        },
          { label:'Fake News Score', value:`${fake}%`, color:'#f5a623',     sub:'likelihood of misinformation' },
        ].map((s,i) => (
          <div key={i} className="card fade-up" style={{ padding:'24px 22px', animationDelay:`${i*0.08}s` }}>
            <div style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>{s.label}</div>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:40, fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontFamily:'var(--ff-body)', fontSize:12, color:'var(--text2)', marginTop:8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <AIDetectionBadge data={data.ai_detection} />
        <FakeNewsDetector data={data.fake_news} />
      </div>

      <PropagationGraph results={data.similarity} originalText={originalText} isImage={false} />
      <SimilarityCard   results={data.similarity} />
    </div>
  )
}