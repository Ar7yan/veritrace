import { useState, useEffect } from 'react'
import { Link, useLocation }   from 'react-router-dom'

const NAV = [
  { path:'/',        label:'Analyze'      },
  { path:'/how',     label:'How It Works' },
  { path:'/results', label:'History'      },
]

export default function Navbar() {
  const loc = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header style={{
      position:'sticky', top:0, zIndex:100,
      background: scrolled ? 'rgba(10,12,16,0.95)' : 'rgba(10,12,16,0.6)',
      backdropFilter:'blur(24px)',
      borderBottom:`1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
      transition:'all 0.35s ease',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 32px', height:68,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none', flexShrink:0 }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="11" fill="rgba(232,201,126,0.09)" stroke="rgba(232,201,126,0.22)" strokeWidth="1"/>
            <circle cx="19" cy="19" r="5.5" stroke="#e8c97e" strokeWidth="1.5" fill="none"/>
            <line x1="19" y1="9"  x2="19" y2="12" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="26" x2="19" y2="29" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="9"  y1="19" x2="12" y2="19" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="26" y1="19" x2="29" y2="19" stroke="#e8c97e" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="12.5" y1="12.5" x2="14.5" y2="14.5" stroke="rgba(232,201,126,0.45)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="23.5" y1="23.5" x2="25.5" y2="25.5" stroke="rgba(232,201,126,0.45)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="25.5" y1="12.5" x2="23.5" y2="14.5" stroke="rgba(232,201,126,0.45)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="14.5" y1="23.5" x2="12.5" y2="25.5" stroke="rgba(232,201,126,0.45)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <div style={{ lineHeight:1 }}>
            <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:17, color:'var(--text1)', letterSpacing:'0.05em' }}>VERITRACE</div>
            <div style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--gold)', letterSpacing:'0.18em', marginTop:3, opacity:0.8 }}>CONTENT INTELLIGENCE</div>
          </div>
        </Link>

        <nav style={{ display:'flex', alignItems:'center', gap:2 }}>
          {NAV.map(({ path, label }) => {
            const active = loc.pathname === path
            return (
              <Link key={path} to={path} style={{
                fontFamily:'var(--ff-body)', fontSize:14, fontWeight: active ? 500 : 400,
                padding:'8px 20px', borderRadius:100, textDecoration:'none',
                color: active ? 'var(--gold)' : 'var(--text2)',
                background: active ? 'rgba(232,201,126,0.09)' : 'transparent',
                border:`1px solid ${active ? 'rgba(232,201,126,0.22)' : 'transparent'}`,
                transition:'all 0.22s',
              }}
              onMouseEnter={e => { if(!active){ e.currentTarget.style.color='var(--text1)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}}
              onMouseLeave={e => { if(!active){ e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.background='transparent' }}}>
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 14px', borderRadius:100,
          background:'rgba(79,255,176,0.06)', border:'1px solid rgba(79,255,176,0.16)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--emerald)', display:'block', animation:'pulse 2.4s ease-in-out infinite' }} />
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--emerald)', letterSpacing:'0.1em' }}>SYSTEM LIVE</span>
        </div>
      </div>
    </header>
  )
}