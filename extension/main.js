const FALLBACK_DATA = [
  { sentence: "She goes to the market every day", isCorrect: true,  explanation: "'Goes' is correct — third-person singular needs -s." },
  { sentence: "He went to school yesterday",      isCorrect: true,  explanation: "'Went' is correct — past tense of 'go'." },
  { sentence: "She go to the market every day",   isCorrect: false, wrongIndex: 1, correct: "goes", explanation: "'Go' → 'goes': third-person singular requires -s." },
  { sentence: "I go to school yesterday",         isCorrect: false, wrongIndex: 1, correct: "went", explanation: "'Go' → 'went': 'yesterday' requires past tense." },
  { sentence: "I want to buy a umbrella",         isCorrect: false, wrongIndex: 5, correct: "an",   explanation: "'A' → 'an': use 'an' before vowel sounds." },
];

async function loadData() {
  try {
    const res = await fetch('data/grammar.json');
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch {
    return FALLBACK_DATA;
  }
}

async function init() {
  const best = localStorage.getItem('grammarSmashBest') || '0';
  document.getElementById('hud-best').textContent = `Best: ${best}`;

  const canvas = document.getElementById('canvas');
  const data = await loadData();
  new GrammarSmash(canvas, data);
}

init();
