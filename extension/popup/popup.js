const API = 'https://remarkable-passion-production-c6b4.up.railway.app/api/analyze/'

const views = {
  input:   document.getElementById('view-input'),
  loading: document.getElementById('view-loading'),
  results: document.getElementById('view-results'),
  error:   document.getElementById('view-error'),
}

function showView(name) {
  Object.values(views).forEach(v => v.classList.add('hidden'))
  views[name].classList.remove('hidden')
}

const inputText  = document.getElementById('input-text')
const charCount  = document.getElementById('char-count')
const btnAnalyze = document.getElementById('btn-analyze')

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('pendingText', ({ pendingText }) => {
    if (pendingText && pendingText.length >= 30) {
      inputText.value       = pendingText
      charCount.textContent = pendingText.length
      btnAnalyze.disabled   = false
      chrome.storage.local.remove('pendingText')
      runAnalysis(pendingText)
    }
  })
})

inputText.addEventListener('input', () => {
  const len             = inputText.value.trim().length
  charCount.textContent = inputText.value.length
  btnAnalyze.disabled   = len < 30
})

btnAnalyze.addEventListener('click', () => {
  const text = inputText.value.trim()
  if (text.length >= 30) runAnalysis(text)
})

document.getElementById('btn-open-app').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://veritrace-beta.vercel.app' })
})

document.getElementById('btn-reset')?.addEventListener('click', () => {
  inputText.value       = ''
  charCount.textContent = '0'
  btnAnalyze.disabled   = true
  showView('input')
})

document.getElementById('btn-open-full')?.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://veritrace-beta.vercel.app' })
})

document.getElementById('btn-retry')?.addEventListener('click', () => showView('input'))

function animateSteps() {
  const steps = ['step-1','step-2','step-3','step-4']
  let i = 0
  const interval = setInterval(() => {
    if (i > 0) document.getElementById(steps[i-1])?.classList.replace('active','done')
    if (i < steps.length) {
      document.getElementById(steps[i])?.classList.add('active')
      i++
    } else clearInterval(interval)
  }, 700)
  return interval
}

function resetSteps() {
  ['step-1','step-2','step-3','step-4'].forEach(id => {
    const el = document.getElementById(id)
    if (el) { el.classList.remove('active','done') }
  })
}

async function runAnalysis(text) {
  showView('loading')
  resetSteps()
  const stepInterval = animateSteps()

  try {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    clearInterval(stepInterval)
    renderResults(data)
    showView('results')
  } catch (err) {
    clearInterval(stepInterval)
    showView('error')
  }
}

function renderResults(data) {
  const ai        = data.ai_detection || {}
  const fake      = data.fake_news    || {}
  const sim       = data.similarity   || []
  const aiPct     = Math.round((ai.ai_probability    || 0) * 100)
  const humanPct  = Math.round((ai.human_probability || 0) * 100)
  const fakeScore = fake.score || 0
  const isAI      = ai.is_ai_generated

  document.getElementById('stat-ai').textContent      = `${aiPct}%`
  document.getElementById('stat-ai').style.color      = isAI ? 'var(--rose)' : 'var(--emerald)'
  document.getElementById('stat-fake').textContent    = `${fakeScore}%`
  document.getElementById('stat-fake').style.color    = fakeScore > 60 ? 'var(--rose)' : fakeScore > 35 ? '#f5a623' : 'var(--emerald)'
  document.getElementById('stat-sources').textContent = sim.length

  const badgeAI       = document.getElementById('badge-ai')
  badgeAI.textContent = ai.label || '—'
  badgeAI.className   = `badge ${isAI ? 'badge-ai' : 'badge-human'}`

  document.getElementById('pct-ai').textContent    = `${aiPct}%`
  document.getElementById('pct-human').textContent = `${humanPct}%`
  setTimeout