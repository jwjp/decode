import './style.css';
import { decoders } from './decoders.js';

const formats = [
  {
    id: 'url', code: '%',
    en: { name: 'URL', description: 'Decode percent escapes and convert + to spaces.', sample: 'Hello%2C+world%21', placeholder: 'Hello%2C+world%21' },
    ko: { name: 'URL', description: '퍼센트 인코딩과 + 문자를 변환합니다.', sample: 'Hello%2C+%EC%84%B8%EA%B3%84%21', placeholder: 'Hello%2C+world%21' },
  },
  {
    id: 'unicode', code: '\\u',
    en: { name: 'Unicode', description: 'Convert Unicode and hex escapes into characters.', sample: '\\u0048\\u0065\\u006C\\u006C\\u006F \\u{1F44B}', placeholder: '\\u0048\\u0065\\u006C\\u006C\\u006F' },
    ko: { name: 'Unicode', description: 'Unicode 및 16진수 이스케이프를 문자로 바꿉니다.', sample: '\\uC548\\uB155\\uD558\\uC138\\uC694 \\u{1F44B}', placeholder: '\\uC548\\uB155\\uD558\\uC138\\uC694' },
  },
  {
    id: 'base64', code: '64',
    en: { name: 'Base64', description: 'Decode Base64 or Base64URL as UTF-8 text.', sample: 'SGVsbG8sIHdvcmxkIQ==', placeholder: 'SGVsbG8sIHdvcmxkIQ==' },
    ko: { name: 'Base64', description: 'Base64 또는 Base64URL을 UTF-8 텍스트로 변환합니다.', sample: '7JWI64WV7ZWY7IS47JqU', placeholder: 'SGVsbG8sIHdvcmxkIQ==' },
  },
  {
    id: 'html', code: '&;',
    en: { name: 'HTML entities', description: 'Convert named and numeric HTML entities into characters.', sample: '&lt;h1&gt;Hello &amp; world&lt;/h1&gt;', placeholder: '&lt;div&gt;Hello &amp; world&lt;/div&gt;' },
    ko: { name: 'HTML 엔티티', description: '이름 및 숫자 HTML 엔티티를 문자로 바꿉니다.', sample: '&lt;h1&gt;Hello &amp; 안녕&lt;/h1&gt;', placeholder: '&lt;div&gt;Hello &amp; world&lt;/div&gt;' },
  },
  {
    id: 'hex', code: '0x',
    en: { name: 'Hex', description: 'Convert hexadecimal bytes into UTF-8 text.', sample: '48 65 6C 6C 6F', placeholder: '48 65 6C 6C 6F' },
    ko: { name: 'Hex', description: '16진수 바이트를 UTF-8 텍스트로 변환합니다.', sample: 'ED 95 9C EA B8 80', placeholder: '48 65 6C 6C 6F' },
  },
  {
    id: 'binary', code: '01',
    en: { name: 'Binary', description: 'Convert 8-bit binary bytes into UTF-8 text.', sample: '01001000 01100101 01101100 01101100 01101111', placeholder: '01001000 01101001' },
    ko: { name: 'Binary', description: '8비트 이진수 바이트를 UTF-8 텍스트로 변환합니다.', sample: '01001000 01100101 01101100 01101100 01101111', placeholder: '01001000 01101001' },
  },
  {
    id: 'json', code: '{}',
    en: { name: 'JSON string', description: 'Interpret escape sequences in a JSON string.', sample: '"Hello\\nworld"', placeholder: '"Hello\\nworld"' },
    ko: { name: 'JSON 문자열', description: 'JSON 문자열의 이스케이프를 해석합니다.', sample: '"Hello\\n\\uC548\\uB155"', placeholder: '"Hello\\nworld"' },
  },
  {
    id: 'jwt', code: 'JWT',
    en: { name: 'JWT / token', description: 'Show the header and payload of a 3-part JWT, or the first JSON object of a 2-part token.', sample: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.', placeholder: 'header.payload.signature or payload.signature' },
    ko: { name: 'JWT / 토큰', description: '3부분 JWT의 Header와 Payload, 또는 2부분 토큰의 첫 JSON을 표시합니다.', sample: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.', placeholder: 'header.payload.signature 또는 payload.signature' },
  },
];

const copy = {
  en: {
    pageTitle: 'decode — Text decoder',
    metaDescription: 'Decode URL, Unicode, Base64, HTML entities, Hex, and more in your browser.',
    home: 'decode home', browserNote: 'Processed in your browser', language: 'Language',
    heroFirst: 'Turn encoded text', heroSecond: 'into something readable.',
    intro: 'Paste an encoded string, choose a format, and see the result instantly.',
    workspaceLabel: 'Decoder workspace', formatLabel: 'Decoding format',
    formatHeading: 'Decoding format', formatCount: '08 FORMATS',
    workspaceHeading: 'Decode text', instant: 'Instant results as you type',
    input: 'Input', output: 'Output', inputLabel: 'Text to decode',
    sample: 'Use example', clear: 'Clear all', copy: 'Copy', copied: 'Copied',
    outputEmpty: 'Your decoded text will appear here.', emptyResult: 'Empty result.',
    waiting: 'Waiting for input', success: 'Decoded', failure: 'Check the input format',
    copyFailed: 'Could not access the clipboard.',
    signatureNote: 'The signature is not verified.',
    footerName: 'A simple text utility', footerPrivacy: 'Your text stays in your browser.',
    count: (value) => `${value} ${value === 1 ? 'character' : 'characters'}`,
    errors: {
      invalidUtf8: 'This is not valid UTF-8 text.',
      invalidBase64: 'Enter valid Base64 or Base64URL text.',
      invalidUrl: 'Invalid URL encoding. Check the hex digits after each % sign.',
      invalidUnicodeEscape: 'Check the Unicode escape format. Example: \\u0041 or \\u{1F600}',
      invalidCodePoint: 'Invalid Unicode code point.',
      unpairedSurrogate: 'Unpaired Unicode surrogate.',
      invalidHex: 'Enter hex in pairs of digits. Example: 48 65 6C',
      invalidBinary: 'Enter binary in groups of 8 bits. Example: 01001000 01101001',
      invalidJsonString: 'Enter a valid quoted JSON string. Example: "Hello\\nworld"',
      invalidTokenParts: 'Enter a token with 2 or 3 dot-separated parts.',
      invalidTokenJson: 'Could not read the JSON part of this token.',
      unknown: 'Could not decode this input.',
    },
  },
  ko: {
    pageTitle: 'decode — 텍스트 디코더',
    metaDescription: 'URL, Unicode, Base64, HTML, Hex 등 다양한 형식의 텍스트를 브라우저에서 디코딩하세요.',
    home: 'decode 홈', browserNote: '브라우저에서 바로 처리', language: '언어',
    heroFirst: '복잡한 문자를', heroSecond: '읽을 수 있는 텍스트로.',
    intro: '인코딩된 문자열을 붙여넣으세요. 형식을 고르면 결과가 바로 나타납니다.',
    workspaceLabel: '디코더 작업 공간', formatLabel: '디코딩 형식',
    formatHeading: '디코딩 형식', formatCount: '08 형식',
    workspaceHeading: '변환하기', instant: '입력 즉시 변환',
    input: '입력', output: '결과', inputLabel: '디코딩할 텍스트',
    sample: '예시 넣기', clear: '모두 지우기', copy: '복사하기', copied: '복사됨',
    outputEmpty: '여기에 디코딩 결과가 표시됩니다.', emptyResult: '빈 결과입니다.',
    waiting: '입력을 기다리는 중', success: '디코딩 완료', failure: '형식을 확인해 주세요',
    copyFailed: '클립보드 접근에 실패했습니다.',
    signatureNote: '서명은 검증하지 않습니다.',
    footerName: '간단한 텍스트 도구', footerPrivacy: '텍스트는 브라우저 안에서 처리됩니다.',
    count: (value) => `${value} 문자`,
    errors: {
      invalidUtf8: '유효한 UTF-8 텍스트가 아닙니다.',
      invalidBase64: '올바른 Base64 형식이 아닙니다.',
      invalidUrl: '잘못된 URL 인코딩입니다. % 뒤의 16진수 값을 확인하세요.',
      invalidUnicodeEscape: 'Unicode 이스케이프 형식을 확인하세요. 예: \\uD55C 또는 \\u{1F600}',
      invalidCodePoint: '유효하지 않은 Unicode 코드 포인트입니다.',
      unpairedSurrogate: '짝이 맞지 않는 Unicode 서로게이트입니다.',
      invalidHex: '16진수는 두 자리씩 입력하세요. 예: ED 95 9C',
      invalidBinary: '2진수는 8비트씩 입력하세요. 예: 01001000 01101001',
      invalidJsonString: '따옴표를 포함한 올바른 JSON 문자열을 입력하세요. 예: "Hello\\nworld"',
      invalidTokenParts: '점으로 구분된 2부분 또는 3부분 토큰을 입력하세요.',
      invalidTokenJson: '토큰의 JSON 부분을 읽을 수 없습니다.',
      unknown: '입력을 디코딩할 수 없습니다.',
    },
  },
};

const app = document.querySelector('#app');
let language = 'en';
try {
  if (localStorage.getItem('decode.language') === 'ko') language = 'ko';
} catch {
  // The site still works when storage is unavailable.
}
let selected = 'url';
let inputValue = '';
let decoded = '';

function setLanguage(nextLanguage) {
  if (language === nextLanguage) return;
  language = nextLanguage;
  try {
    localStorage.setItem('decode.language', language);
  } catch {
    // A private browsing session may not allow storage.
  }
  render();
  app.querySelector(`[data-language="${language}"]`).focus();
}

function render() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]').content = t.metaDescription;
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="./" aria-label="${t.home}"><span class="brand-mark">d<span>.</span></span><span>decode</span></a>
        <div class="top-actions">
          <span class="top-note"><span class="status-dot"></span> ${t.browserNote}</span>
          <div class="language-switch" role="group" aria-label="${t.language}">
            <button type="button" data-language="en" lang="en" aria-pressed="${language === 'en'}">EN</button>
            <button type="button" data-language="ko" lang="ko" aria-pressed="${language === 'ko'}">한국어</button>
          </div>
        </div>
      </header>

      <main>
        <div class="intro">
          <div class="eyebrow"><span class="eyebrow-line"></span> TEXT UTILITY / 001</div>
          <h1>${t.heroFirst}<br><em>${t.heroSecond}</em></h1>
          <p>${t.intro}</p>
        </div>

        <section class="workspace" aria-label="${t.workspaceLabel}">
          <div class="workspace-heading"><div><span class="section-kicker">01 / FORMAT</span><h2>${t.formatHeading}</h2></div><span class="format-count">${t.formatCount}</span></div>
          <div class="format-grid" role="group" aria-label="${t.formatLabel}"></div>

          <div class="editor-heading"><div><span class="section-kicker">02 / WORKSPACE</span><h2>${t.workspaceHeading}</h2></div><span class="keyboard-hint">${t.instant}</span></div>
          <div class="editor-grid">
            <section class="editor-panel input-panel" aria-labelledby="input-title">
              <div class="panel-top"><div><span class="panel-index">IN / 01</span><h3 id="input-title">${t.input}</h3></div><button class="text-button" id="sample-button" type="button">${t.sample} <span aria-hidden="true">↗</span></button></div>
              <textarea id="input" spellcheck="false" aria-label="${t.inputLabel}"></textarea>
              <div class="panel-bottom"><span id="input-count"></span><button class="text-button" id="clear-button" type="button">${t.clear}</button></div>
            </section>
            <div class="arrow" aria-hidden="true">→</div>
            <section class="editor-panel output-panel" aria-labelledby="output-title">
              <div class="panel-top"><div><span class="panel-index">OUT / 02</span><h3 id="output-title">${t.output}</h3></div><button class="copy-button" id="copy-button" type="button" disabled></button></div>
              <pre id="output" class="output empty" aria-live="polite"></pre>
              <div class="panel-bottom"><span id="result-status"></span><span id="output-count"></span></div>
            </section>
          </div>
          <div class="format-help" id="format-help"></div>
        </section>
      </main>

      <footer><span>decode <span class="footer-spark">✳</span> ${t.footerName}</span><span>${t.footerPrivacy}</span></footer>
    </div>
  `;

  const grid = app.querySelector('.format-grid');
  const input = app.querySelector('#input');
  const output = app.querySelector('#output');
  const copyButton = app.querySelector('#copy-button');
  const status = app.querySelector('#result-status');
  const inputCount = app.querySelector('#input-count');
  const outputCount = app.querySelector('#output-count');
  const help = app.querySelector('#format-help');

  function setStatus(dotClass, message) {
    const dot = document.createElement('span');
    dot.className = `small-dot ${dotClass}`;
    status.replaceChildren(dot, document.createTextNode(message));
  }

  function setCopyLabel(label, icon) {
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = icon;
    copyButton.replaceChildren(document.createTextNode(`${label} `), symbol);
  }

  function updateFormat() {
    const format = formats.find((item) => item.id === selected)[language];
    input.placeholder = format.placeholder;
    help.textContent = format.description + (selected === 'jwt' ? ` ${t.signatureNote}` : '');
  }

  function updateResult() {
    inputValue = input.value;
    inputCount.textContent = t.count([...inputValue].length);
    output.classList.remove('error');
    if (!inputValue) {
      decoded = '';
      output.textContent = t.outputEmpty;
      output.classList.add('empty');
      setStatus('', t.waiting);
    } else {
      try {
        decoded = decoders[selected](inputValue);
        output.textContent = decoded || t.emptyResult;
        output.classList.toggle('empty', !decoded);
        setStatus('success', t.success);
      } catch (error) {
        decoded = '';
        output.textContent = t.errors[error.code] || t.errors.unknown;
        output.classList.remove('empty');
        output.classList.add('error');
        setStatus('failure', t.failure);
      }
    }
    outputCount.textContent = t.count([...decoded].length);
    copyButton.disabled = !decoded;
    setCopyLabel(t.copy, '⧉');
  }

  for (const format of formats) {
    const button = document.createElement('button');
    button.className = 'format-card';
    button.type = 'button';
    button.dataset.format = format.id;
    button.setAttribute('aria-pressed', String(format.id === selected));
    button.innerHTML = '<span class="format-code"></span><span class="format-name"></span><span class="format-arrow" aria-hidden="true">↗</span>';
    button.querySelector('.format-code').textContent = format.code;
    button.querySelector('.format-name').textContent = format[language].name;
    button.addEventListener('click', () => {
      selected = format.id;
      grid.querySelectorAll('.format-card').forEach((card) => card.setAttribute('aria-pressed', String(card === button)));
      updateFormat();
      updateResult();
    });
    grid.append(button);
  }

  app.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
  input.value = inputValue;
  input.addEventListener('input', updateResult);
  app.querySelector('#sample-button').addEventListener('click', () => {
    input.value = formats.find((item) => item.id === selected)[language].sample;
    updateResult();
    input.focus();
  });
  app.querySelector('#clear-button').addEventListener('click', () => {
    input.value = '';
    updateResult();
    input.focus();
  });
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(decoded);
      setCopyLabel(t.copied, '✓');
    } catch {
      setStatus('failure', t.copyFailed);
    }
  });

  updateFormat();
  updateResult();
}

render();
