export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ position:'relative', zIndex:10, marginTop:120, borderTop:'1px solid rgba(255,255,255,0.05)', background:'var(--ink2)' }}>
      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(232,201,126,0.25),transparent)' }} />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 32px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:60 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
                <rect width="38" height="38" rx="11" fill="rgba(232,201,126,0.09)" stroke="rgba(232,201,126,0.22)" strokeWidth="1"/>
                <circle cx="19" cy="19" r="5.5" stroke="#e8c97e" strokeWidth="1.5" fill="none"/>
                <line x1="19" y1="9" x2="19" y2="12" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="19" y1="26" x2="19" y2="29" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="19" x2="12" y2="19" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="26" y1="19" x2="29" y2="19" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15, color:'var(--text1)', letterSpacing:'0.05em' }}>VERITRACE</span>
            </div>
            <p style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', lineHeight:1.7, maxWidth:260 }}>
              Advanced AI content intelligence platform for detecting, tracking, and verifying digital content propagation.
            </p>
            <div style={{ display:'flex', gap:8, marginTop:20, flexWrap:'wrap' }}>
              {['AI Powered','Open Source','Real-time'].map(t => (
                <span key={t} style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--text3)',
                  padding:'3px 10px', borderRadius:100,
                  background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)', letterSpacing:'0.08em' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {[
            { title:'Product',   links:['Analyze','History','API Docs','Changelog'] },
            { title:'Resources', links:['How It Works','Use Cases','Research','FAQ'] },
            { title:'Legal',     links:['Privacy','Terms','Cookie Policy','Contact'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--gold)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>{title}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e=>e.target.style.color='var(--text1)'}
                      onMouseLeave={e=>e.target.style.color='var(--text2)'}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ height:1, background:'rgba(255,255,255,0.05)', marginBottom:24 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)' }}>© {year} VERITRACE · Built for IEEE Hackathon</p>
          <div style={{ display:'flex', gap:20 }}>
            {['Twitter','GitHub','Discord'].map(s => (
              <a key={s} href="#" style={{ fontFamily:'var(--ff-mono)', fontSize:11, color:'var(--text3)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='var(--gold)'}
                onMouseLeave={e=>e.target.style.color='var(--text3)'}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}