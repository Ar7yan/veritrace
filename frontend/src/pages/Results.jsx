export default function Results() {
  return (
    <main style={{ position:'relative', zIndex:10, maxWidth:900, margin:'0 auto', padding:'80px 24px 120px' }}>
      <div className="card fade-up" style={{ padding:60, textAlign:'center' }}>
        <div style={{ fontFamily:'var(--ff-display)', fontSize:48, color:'var(--gold)', marginBottom:16, opacity:0.3 }}>◈</div>
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:28, fontWeight:700, color:'var(--text1)', marginBottom:12 }}>Analysis History</h1>
        <p style={{ fontFamily:'var(--ff-mono)', fontSize:12, color:'var(--text2)' }}>Coming soon — save and compare multiple analyses.</p>
      </div>
    </main>
  )
}