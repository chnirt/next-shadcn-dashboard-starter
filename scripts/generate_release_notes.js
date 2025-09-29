#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Config ---
const VERSION = process.env.VERSION || process.argv[2] || 'v1.0.0-beta.1';
if (!VERSION) {
  console.error('❌ Please provide VERSION via env or argument, e.g., v1.0.0');
  process.exit(1);
}
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log(
  `📌 Generating release notes for version: ${VERSION} (provider: ${AI_PROVIDER})`
);

// --- Detect previous tag ---
let prevTag;
try {
  prevTag = execSync(`git describe --tags --abbrev=0 ${VERSION}^`, {
    encoding: 'utf8'
  }).trim();
  console.log(`📌 Previous tag detected: ${prevTag}`);
} catch {
  prevTag = execSync('git rev-list --max-parents=0 HEAD', {
    encoding: 'utf8'
  }).trim();
  console.log(`📌 No previous tag found. Using initial commit ${prevTag}`);
}

// --- Collect commits ---
let diff;
try {
  diff = execSync(`git log ${prevTag}..${VERSION} --pretty=format:'%h %s'`, {
    encoding: 'utf8'
  });
  console.log(`📌 Collected ${diff.split('\n').length} commits`);
} catch (e) {
  console.error('❌ Error collecting commits:', e);
  diff = '';
}

// --- Build prompt ---
const PROMPT = `You are an expert solution architect. Generate release notes for version ${VERSION} based on these commits:

${diff}

Requirements:
- Output in clean Markdown
- Include headings: Release Notes, Classification, Summary, Details, Known Issues, Next Steps, Contributors
- Use bullet points for changes with commit hashes
- Proper line breaks, no code blocks
- Focus on clarity and readability
`;

// --- AI Calls ---
async function callOpenAI() {
  console.log('🚀 Calling OpenAI API...');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: PROMPT }],
      temperature: 0.2
    })
  });
  const data = await res.json();
  if (data.error?.message) {
    console.error('❌ OpenAI API error:', data.error.message);
    return '';
  }
  console.log('✅ AI response received from OpenAI');
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini() {
  console.log('🚀 Calling Gemini API...');
  const body = { contents: [{ parts: [{ text: PROMPT }] }] };
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(body)
    }
  );
  const data = await res.json();
  console.log('✅ AI response received from Gemini');
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// --- Summary helper ---
function generateSummary(markdown) {
  // Lấy phần Summary nếu có
  const match = markdown.match(/## Summary\s*\n([\s\S]*?)(\n##|$)/i);
  if (match) {
    const lines = match[1]
      .split('\n')
      .map((l) => l.replace(/\([0-9a-f]{6,}\)/g, '').trim())
      .filter((l) => l && !l.startsWith('#')); // loại bỏ heading
    return lines.slice(0, 2).join(' | ');
  }
  // Fallback: dòng đầu tiên không phải heading
  const firstLine = markdown
    .split('\n')
    .find((l) => l.trim() && !l.startsWith('#'));
  return firstLine || '';
}

// --- Main ---
(async () => {
  let response = '';
  if (AI_PROVIDER === 'openai') response = await callOpenAI();
  else if (AI_PROVIDER === 'gemini') response = await callGemini();
  else {
    console.error('❌ Unknown AI_PROVIDER:', AI_PROVIDER);
    process.exit(1);
  }

  if (!response || response === 'null')
    response = '(No AI-generated notes. Please update manually.)';

  // --- Create folder ---
  const releaseFolder = path.join('docs', 'release-notes');
  if (!fs.existsSync(releaseFolder))
    fs.mkdirSync(releaseFolder, { recursive: true });

  // --- Save detailed release notes ---
  const releaseFile = path.join(releaseFolder, `release-${VERSION}.md`);
  fs.writeFileSync(
    releaseFile,
    `## Release Notes - ${VERSION}\n\n${response}\n`
  );
  console.log(`✅ Detailed release notes saved: ${releaseFile}`);

  // --- Append summary to CHANGELOG ---
  const changelogFile = 'CHANGELOG.md';
  const summary = generateSummary(response);
  let changelog = '';
  if (fs.existsSync(changelogFile))
    changelog = fs.readFileSync(changelogFile, 'utf8');

  if (!changelog.includes(`## ${VERSION}`)) {
    fs.appendFileSync(changelogFile, `\n## ${VERSION}\n- ${summary}\n`);
    console.log(`✅ Summary appended to CHANGELOG.md`);
  } else {
    console.log(`⚠️ Version ${VERSION} already exists in CHANGELOG.md`);
  }
})();
