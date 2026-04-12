import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { useMemo, useCallback } from 'react'

function OriginNode({ data }) {
  return (
    <>
      <Handle type="source" position={Position.Bottom}
        style={{ background:'rgba(232,201,126,0.5)', border:'none', width:8, height:8 }} />
      <div style={{ background:'rgba(232,201,126,0.1)', border:'1.5px solid rgba(232,201,126,0.45)',
        borderRadius:14, padding:'12px 22px', textAlign:'center', minWidth:140 }}>
        <div style={{ fontFamily:'DM Mono,monospace', fontSize:9, color:'rgba(232,201,126,0.6)', letterSpacing:'0.14em', marginBottom:5 }}>
          {data.isImage ? 'UPLOADED IMAGE' : 'YOUR CONTENT'}
        </div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, color:'#e8c97e' }}>
          ⬡ Origin
        </div>
        <div style={{ fontFamily:'DM Mono,monospace', fontSize:9, color:'rgba(232,201,126,0.5)', marginTop:4 }}>
          {data.isImage ? 'Image Analysis' : `${data.wordCount} words · ${data.charCount} chars`}
        </div>
      </div>
    </>
  )
}

function MatchNode({ data }) {
  const colorMap = {
    High:   { color:'#ff6b8a', bg:'rgba(255,107,138,0.08)', border:'rgba(255,107,138,0.3)' },
    Medium: { color:'#f5a623', bg:'rgba(245,166,35,0.08)',  border:'rgba(245,166,35,0.3)'  },
    Low:    { color:'#4fffb0', bg:'rgba(79,255,176,0.08)',  border:'rgba(79,255,176,0.3)'  },
  }
  const c = colorMap[data.matchLevel] || colorMap.Low

  return (
    <>
      <Handle type="target" position={Position.Top}
        style={{ background:c.color, border:'none', width:6, height:6, opacity:0.6 }} />
      <div style={{ background:c.bg, border:`1px solid ${c.border}`,
        borderRadius:12, padding:'10px 14px', maxWidth:170, minWidth:150, cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <div style={{ fontFamily:'DM Mono,monospace', fontSize:10, color:c.color, fontWeight:500, letterSpacing:'0.04em' }}>
            {data.source}
          </div>
          <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, fontWeight:700, color:c.color }}>
            {data.similarity}%
          </div>
        </div>
        <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'rgba(238,241,248,0.85)', lineHeight:1.45,
          overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
          {data.title}
        </div>
        <div style={{ marginTop:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'DM Mono,monospace', fontSize:8, color:c.color, background:c.bg,
            border:`1px solid ${c.border}`, borderRadius:100, padding:'2px 7px', letterSpacing:'0.08em' }}>
            {data.matchLevel} MATCH
          </div>
          <div style={{ fontFamily:'DM Mono,monospace', fontSize:8, color:'rgba(138,148,170,0.6)' }}>
            {data.date}
          </div>
        </div>
      </div>
    </>
  )
}

const nodeTypes = { origin: OriginNode, match: MatchNode }

export default function PropagationGraph({ results, originalText = '', isImage = false }) {
  const { nodes, edges } = useMemo(() => {
    if (!results?.length) return { nodes: [], edges: [] }

    const wordCount = originalText.trim().split(/\s+/).length
    const charCount = originalText.length
    const colorMap  = { High:'#ff6b8a', Medium:'#f5a623', Low:'#4fffb0' }

    const nodes = [{
      id: 'origin', type: 'origin',
      data: { wordCount, charCount, isImage },
      position: { x: 260, y: 10 },
      draggable: true,
    }]
    const edges = []

    results.slice(0, 9).forEach((r, i) => {
      const c  = colorMap[r.match_level] || '#4fffb0'
      const id = `match-${i}`
      nodes.push({
        id, type: 'match',
        data: { title:r.title||r.source, source:r.source, similarity:r.similarity, matchLevel:r.match_level, date:r.date, link:r.link },
        position: { x:(i%3)*230+20, y:Math.floor(i/3)*155+160 },
        draggable: true,
      })
      edges.push({
        id:`e-${i}`, source:'origin', target:id,
        animated: r.match_level === 'High',
        type: 'smoothstep',
        style: { stroke:c, strokeWidth: r.match_level==='High' ? 1.5 : 1, opacity: r.match_level==='High' ? 0.7 : 0.35 },
        label: `${r.similarity}% similar`,
        labelStyle: { fontFamily:'DM Mono, monospace', fontSize:9, fill:c, opacity:0.8 },
        labelBgStyle: { fill:'#0a0c10', fillOpacity:0.8 },
        markerEnd: { type:'arrowclosed', color:c, width:10, height:10 },
      })
    })

    return { nodes, edges }
  }, [results, originalText, isImage])

  const onNodeClick = useCallback((_, node) => {
    if (node.data?.link) window.open(node.data.link, '_blank')
  }, [])

  if (!results?.length) return null

  const high   = results.filter(r => r.match_level==='High').length
  const medium = results.filter(r => r.match_level==='Medium').length
  const low    = results.filter(r => r.match_level==='Low').length

  return (
    <div className="card fade-up d3" style={{ padding:28 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)',
            letterSpacing:'0.12em', textTransform:'uppercase',
            background:'rgba(255,255,255,0.04)', border:'1px solid var(--rim)',
            padding:'3px 12px', borderRadius:100, display:'inline-block', marginBottom:12 }}>
            Propagation Graph
          </span>
          <p style={{ fontFamily:'var(--ff-body)', fontSize:13, color:'var(--text2)', lineHeight:1.6, maxWidth:480 }}>
            {isImage
              ? 'Each node shows a website where this image or visually similar images have appeared. Edges show how closely related each source is to your uploaded image.'
              : 'Each node shows a website where this content appears. Edges show the similarity link back to your original text. Click any node to open the source.'}
          </p>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0, marginLeft:16 }}>
          {[{label:'High',count:high,color:'#ff6b8a'},{label:'Medium',count:medium,color:'#f5a623'},{label:'Low',count:low,color:'#4fffb0'}].map(({label,count,color})=>(
            <div key={label} style={{ textAlign:'center', padding:'8px 12px', borderRadius:10,
              background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:18, fontWeight:700, color }}>{count}</div>
              <div style={{ fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.08em', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:20, marginBottom:14 }}>
        {[
          { color:'#ff6b8a', label:'High (>75%) — very likely same content' },
          { color:'#f5a623', label:'Medium (45–75%) — related content'       },
          { color:'#4fffb0', label:'Low (<45%) — loosely related'             },
        ].map(({color,label})=>(
          <div key={label} style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
            <span style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height:420, borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,255,255,0.05)', background:'#080b14' }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onNodeClick={onNodeClick} fitView fitViewOptions={{ padding:0.2 }} minZoom={0.4} maxZoom={1.8}>
          <Background color="rgba(232,201,126,0.03)" gap={36} size={1} />
          <Controls style={{ background:'rgba(16,20,30,0.95)', border:'1px solid rgba(255,255,255,0.08)' }} />
          <MiniMap
            nodeColor={n => n.id==='origin' ? '#e8c97e' : n.data?.matchLevel==='High' ? '#ff6b8a' : n.data?.matchLevel==='Medium' ? '#f5a623' : '#4fffb0'}
            maskColor="rgba(8,11,20,0.85)"
            style={{ background:'rgba(16,20,30,0.95)', border:'1px solid rgba(255,255,255,0.08)' }} />
        </ReactFlow>
      </div>
      <p style={{ fontFamily:'var(--ff-mono)', fontSize:10, color:'var(--text3)', marginTop:12, letterSpacing:'0.06em' }}>
        Click any node to open source · Drag to rearrange · Scroll to zoom · Animated edges = high similarity
      </p>
    </div>
  )
}