chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'openGame') {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  }
});
