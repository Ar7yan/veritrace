export default function HowItWorks() {
  const steps = [
    { num:'01', title:'Paste Content or Upload Image', desc:'Input any text — article, tweet, headline — or upload a JPG/PNG. Minimum 30 characters for text.' },
    { num:'02', title:'AI Detection',                  desc:'A local HuggingFace RoBERTa model scores the probability of AI vs human authorship for text. A separate CV model handles images.' },
    { num:'03', title:'Fake News Analysis',             desc:'Linguistic patterns are scanned for sensationalism, unverified claims, and misinformation signals. Images use metadata and AI-probability signals.' },
    { num:'04', title:'Web Search / Reverse Image',    desc:'SerpAPI searches Google for text propagation, or Google Lens for reverse image search to find where visuals have spread.' },
    { num:'05', title:'Similarity Scoring',             desc:'Sentence-transformers compute cosine similarity between your content and each web result found.' },
    { num:'06', title:'Propagation Graph',              desc:'All results are visualized as an interactive network graph showing origin node and spread nodes with similarity edges.' },
  ]

  return (
    <main style={{ position:'relative', zIndex:10, maxWidth:900, margin:'0 auto', padding:'80px 24px 120px' }}>
      <div className="fade-up" style={{ marginBottom:60 }}>
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:56, fontWeight:800, color:'var(--text1)', marginBottom:16 }}>
          How It <span style={{ color:'var(--gold)' }}>Works</span>
        </h1>
        <p style={{ fontFamily:'var(--ff-body)', fontSize:17, color:'var(--text2)', maxWidth:500, lineHeight:1.8 }}>
          Six stages of analysis run in parallel, delivering a complete picture of your content in seconds.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {steps.map(({ num, title, desc }, i) => (
          <div key={num} className={`card fade-up d${Math.min(i+1,5)}`} style={{ padding:28, display:'flex', gap:20 }}>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:40, fontWeight:800, color:'rgba(232,201,126,0.15)', lineHeight:1, flexShrink:0 }}>{num}</div>
            <div>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:17, fontWeight:600, color:'var(--text1)', marginBottom:8 }}>{title}</div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', lineHeight:1.7 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}