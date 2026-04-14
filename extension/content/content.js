let floatBtn = null

document.addEventListener('mouseup', (e) => {
  const selected = window.getSelection().toString().trim()
  if (floatBtn) { floatBtn.remove(); floatBtn = null }
  if (selected.length < 30) return

  floatBtn = document.createElement('div')
  floatBtn.innerHTML = `
    <div id="vt-btn" style="
      position: fixed;
      z-index: 999999;
      top: ${Math.max(10, e.clientY - 52)}px;
      left: ${Math.min(e.clientX, window.innerWidth - 220)}px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #10141e;
      border: 1px solid rgba(232,201,126,0.4);
      border-radius: 100px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(232,201,126,0.15);
      cursor: pointer;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #e8c97e;
      letter-spacing: 0.05em;
      white-space: nowrap;
      user-select: none;
      transition: all 0.2s;
    ">
      <svg width="13" height="13" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="5" stroke="#e8c97e" stroke-width="2" fill="none"/>
        <path d="M18 8v3M18 25v3M8 18h3M25 18h3" stroke="#e8c97e" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Analyze with Veritrace
    </div>
  `

  document.body.appendChild(floatBtn)
  const btn = floatBtn.querySelector('#vt-btn')

  btn.addEventListener('mouseenter', () => {
    btn.style.background  = '#1c2333'
    btn.style.boxShadow   = '0 8px 32px rgba(0,0,0,0.7), 0 0 30px rgba(232,201,126,0.25)'
    btn.style.transform   = 'scale(1.03)'
  })
  btn.addEventListener('mouseleave', () => {
    btn.style.background  = '#10141e'
    btn.style.boxShadow   = '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(232,201,126,0.15)'
    btn.style.transform   = 'scale(1)'
  })
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'ANALYZE_SELECTION', text: selected })
    chrome.storage.local.set({ pendingText: selected })
    floatBtn.remove()
    floatBtn = null
  })
})

document.addEventListener('mousedown', (e) => {
  if (floatBtn && !floatBtn.contains(e.target)) {
    floatBtn.remove()
    floatBtn = null
  }
})