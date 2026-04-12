export default function FakeNewsDetector({ data }) {
  if (!data) return null
  const { verdict, score, reasons, sources } = data

  const cfg = verdict === 'FAKE'
    ? { color:'var(--rose)',    bg:'rgba(255,107,138,0.08)', border:'rgba(255,107,138,0.2)', icon:'✕', label:'LIKELY FAKE' }
    : verdict === 'REAL'
    ? { color:'var(--emerald)', bg:'rgba(79,255,176,0.08)',  border:'rgba(79,255,176,0.2)',  icon:'✓', label:'LIKELY REAL' }
    : { color:'#f5a623',        bg:'rgba(245,166,35,0.08)',  border:'rgba(245,166,35,0.2)',  icon:'?', label:'UNCERTAIN'  }

  return (
    <div className="card fade-up d2" style={{ padding:28 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
          letterSpacing:'0.12em', textTransform:'uppercase',
          background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)',
          padding:'3px 12px', borderRadius:100 }}>
          Fake News Detector
        </span>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--gold)',
          background:'rgba(232,201,126,0.08)', border:'1px solid rgba(232,201,126,0.2)',
          padding:'3px 10px', borderRadius:100, letterSpacing:'0.1em' }}>
          ◆ NEW
        </span>
      </div>

      <div style={{ borderRadius:14, padding:'18px 20px', marginBottom:24,
        background:cfg.bg, border:`1px solid ${cfg.border}`,
        display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:cfg.bg,
          border:`2px solid ${cfg.color}`, display:'flex', alignItems:'center',
          justifyContent:'center', fontFamily:'var(--ff-display)', fontSize:20,
          fontWeight:700, color:cfg.color, flexShrink:0 }}>
          {cfg.icon}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:22, fontWeight:700, color:cfg.color }}>{cfg.label}</div>
          <div style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text2)', marginTop:2, letterSpacing:'0.06em' }}>
            Fake probability: {score}%
          </div>
        </div>
        <div style={{ fontFamily:'var(--ff-display)', fontSize:36, fontWeight:700, color:cfg.color }}>
          {score}<span style={{ fontSize:16 }}>%</span>
        </div>
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--emerald)', letterSpacing:'0.08em' }}>REAL</span>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--rose)', letterSpacing:'0.08em' }}>FAKE</span>
        </div>
        <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${score}%`, borderRadius:4,
            background:'linear-gradient(90deg, var(--emerald), #f5a623, var(--rose))',
            transition:'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
      </div>

      {reasons?.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
            letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>
            Detection Signals
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, marginTop:1,
                  background:'rgba(123,97,255,0.12)', border:'1px solid rgba(123,97,255,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--ff-mono)', fontSize:9, color:'#a78bfa' }}>
                  {i+1}
                </div>
                <span style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sources?.length > 0 && (
        <div>
          <div style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
            letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>
            Source Cross-Check
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {sources.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'9px 14px', borderRadius:10,
                background:'rgba(255,255,255,0.02)', border:'1px solid var(--rim)' }}>
                <span style={{ fontFamily:'var(--ff-mono)', fontSize:12, color:'var(--text2)' }}>{s.name}</span>
                <span style={{ fontFamily:'var(--ff-mono)', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase',
                  padding:'3px 10px', borderRadius:100,
                  background: s.supports ? 'rgba(79,255,176,0.08)' : 'rgba(255,107,138,0.08)',
                  color: s.supports ? 'var(--emerald)' : 'var(--rose)',
                  border:`1px solid ${s.supports ? 'rgba(79,255,176,0.2)' : 'rgba(255,107,138,0.2)'}` }}>
                  {s.supports ? '✓ Supports' : '✕ Contradicts'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}