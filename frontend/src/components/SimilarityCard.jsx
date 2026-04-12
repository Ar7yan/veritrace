import { useState } from 'react'

const matchCfg = {
  High:   { color:'var(--rose)',    bg:'rgba(255,107,138,0.06)',  border:'rgba(255,107,138,0.18)' },
  Medium: { color:'#f5a623',        bg:'rgba(245,166,35,0.06)',   border:'rgba(245,166,35,0.18)'  },
  Low:    { color:'var(--emerald)', bg:'rgba(79,255,176,0.06)',   border:'rgba(79,255,176,0.18)'  },
}

export default function SimilarityCard({ results }) {
  const [open, setOpen] = useState(null)
  if (!results?.length) return null

  return (
    <div className="card fade-up d4" style={{ padding:28 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
          letterSpacing:'0.12em', textTransform:'uppercase',
          background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)',
          padding:'3px 12px', borderRadius:100 }}>
          Similarity Matches
        </span>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--sky)',
          background:'rgba(126,184,245,0.08)', border:'1px solid rgba(126,184,245,0.2)',
          padding:'3px 10px', borderRadius:100, letterSpacing:'0.08em' }}>
          {results.length} sources found
        </span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {results.map((r, i) => {
          const c      = matchCfg[r.match_level] || matchCfg.Low
          const isOpen = open === i
          return (
            <div key={i} onClick={() => setOpen(isOpen ? null : i)}
              style={{ borderRadius:12, cursor:'pointer', transition:'all 0.25s',
                background: isOpen ? c.bg : 'rgba(255,255,255,0.02)',
                border:`1px solid ${isOpen ? c.border : 'rgba(255,255,255,0.05)'}`,
                padding:'14px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:c.bg, border:`1px solid ${c.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--ff-display)', fontWeight:700, fontSize:12, color:c.color, flexShrink:0 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:14, fontWeight:500, color:'var(--text1)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>
                    {r.title}
                  </div>
                  <div style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)' }}>
                    {r.source} · {r.date}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  <div>
                    <div style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:c.color, textAlign:'right' }}>
                      {r.similarity}%
                    </div>
                    <div style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--text3)', textAlign:'right', letterSpacing:'0.06em' }}>
                      {r.match_level}
                    </div>
                  </div>
                  <svg style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.25s', flexShrink:0 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', lineHeight:1.7, marginBottom:12 }}>
                    {r.snippet}
                  </p>
                  <a href={r.link} target="_blank" rel="noreferrer"
                    style={{ display:'inline-flex', alignItems:'center', gap:6,
                      fontFamily:'var(--ff-mono)', fontSize:11, color:c.color, textDecoration:'none',
                      padding:'5px 14px', borderRadius:100, background:c.bg, border:`1px solid ${c.border}` }}>
                    Visit Source
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}