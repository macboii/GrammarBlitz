const FALLBACK_DATA = [
  { sentence: "She goes to the market every day", isCorrect: true,  explanation: "'Goes' is correct — third-person singular (she/he/it) needs -s in present tense." },
  { sentence: "He went to school yesterday",      isCorrect: true,  explanation: "'Went' is correct — past tense of 'go'." },
  { sentence: "She go to the market every day",   isCorrect: false, explanation: "'Go' → 'goes': third-person singular requires -s in present tense." },
  { sentence: "I go to school yesterday",         isCorrect: false, explanation: "'Go' → 'went': 'yesterday' requires past tense." },
  { sentence: "I want to buy a umbrella",         isCorrect: false, explanation: "'A' → 'an': use 'an' before vowel sounds." },
];

async function loadData() {
  // 1. Supabase から一括取得 (起動時1回のみ)
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/grammarsmash_sentences?select=sentence,is_correct,explanation&order=created_at.asc`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length >= 10) {
        return rows.map(r => ({ sentence: r.sentence, isCorrect: r.is_correct, explanation: r.explanation }));
      }
    }
  } catch (_) {}

  // 2. 로컬 grammar.json fallback
  try {
    const res = await fetch('data/grammar.json');
    if (res.ok) return await res.json();
  } catch (_) {}

  // 3. 하드코딩 fallback
  return FALLBACK_DATA;
}

async function init() {
  const best = localStorage.getItem('grammarSmashBest') || '0';
  document.getElementById('hud-best').textContent = `Best: ${best}`;

  const canvas = document.getElementById('canvas');
  const data = await loadData();
  new GrammarSmash(canvas, data);
}

init();
