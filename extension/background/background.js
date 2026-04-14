chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'veritrace-analyze',
    title: '🔍 Analyze with Veritrace',
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'veritrace-analyze' && info.selectionText) {
    chrome.storage.local.set(
      { pendingText: info.selectionText.trim() },
      () => chrome.action.openPopup()
    )
  }
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ANALYZE_SELECTION') {
    chrome.storage.local.set({ pendingText: msg.text })
  }
})