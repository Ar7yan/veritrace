export default function AIDetectionBadge({ data }) {
  if (!data) return null
  const ai = Math.round(data.ai_probability * 100)
  const hu = Math.round(data.human_probability * 100)
  const isAI = data.is_ai_generated

  return (
    <div className="card fade-up d1" style={{ padding:28 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
          letterSpacing:'0.12em', textTransform:'uppercase',
          background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)',
          padding:'3px 12px', borderRadius:100 }}>
          AI Detection
        </span>
      </div>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:56, fontWeight:700, lineHeight:1,
            color: isAI ? 'var(--rose)' : 'var(--emerald)' }}>
            {ai}<span style={{ fontSize:24 }}>%</span>
          </div>
          <div style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text2)', marginTop:6, letterSpacing:'0.08em' }}>
            AI PROBABILITY
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:18, fontWeight:600,
            color: isAI ? 'var(--rose)' : 'var(--emerald)',
            padding:'8px 18px', borderRadius:100,
            background: isAI ? 'rgba(255,107,138,0.1)' : 'rgba(79,255,176,0.1)',
            border:`1px solid ${isAI ? 'rgba(255,107,138,0.25)' : 'rgba(79,255,176,0.25)'}` }}>
            {data.label}
          </div>
          <div style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', marginTop:8, letterSpacing:'0.08em' }}>
            {data.confidence} CONFIDENCE
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {[
          { label:'AI Generated',  pct:ai, color:'var(--rose)'    },
          { label:'Human Written', pct:hu, color:'var(--emerald)' },
        ].map(({ label, pct, color }) => (
          <div key={label}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text2)', letterSpacing:'0.06em' }}>{label}</span>
              <span style={{ fontFamily:'var(--ff-mono)', fontSize:11, color, fontWeight:500 }}>{pct}%</span>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:4, transition:'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>
        ))}
      </div>

      {data.note && (
        <div style={{ marginTop:20, padding:'10px 14px', borderRadius:10,
          background:'rgba(232,201,126,0.05)', border:'1px solid rgba(232,201,126,0.15)' }}>
          <p style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--gold)', letterSpacing:'0.06em' }}>◉ {data.note}</p>
        </div>
      )}
    </div>
  )
}