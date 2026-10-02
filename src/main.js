import './style.css';
import { decoders } from './decoders.js';

const formats = [
  { id: 'url', name: 'URL', code: '%', description: '퍼센트 인코딩과 + 문자를 변환합니다.', sample: 'Hello%2C+%EC%84%B8%EA%B3%84%21', placeholder: 'Hello%2C+world%21' },
  { id: 'unicode', name: 'Unicode', code: '\\u', description: 'Unicode 및 16진수 이스케이프를 문자로 바꿉니다.', sample: '\\uC548\\uB155\\uD558\\uC138\\uC694 \\u{1F44B}', placeholder: '\\uC548\\uB155\\uD558\\uC138\\uC694' },
  { id: 'base64', name: 'Base64', code: '64', description: 'Base64 또는 Base64URL을 UTF-8 텍스트로 변환합니다.', sample: '7JWI64WV7ZWY7IS47JqU', placeholder: 'SGVsbG8sIHdvcmxkIQ==' },
  { id: 'html', name: 'HTML 엔티티', code: '&;', description: '이름 및 숫자 HTML 엔티티를 문자로 바꿉니다.', sample: '&lt;h1&gt;Hello &amp; 안녕&lt;/h1&gt;', placeholder: '&lt;div&gt;Hello &amp; world&lt;/div&gt;' },
  { id: 'hex', name: 'Hex', code: '0x', description: '16진수 바이트를 UTF-8 텍스트로 변환합니다.', sample: 'ED 95 9C EA B8 80', placeholder: '48 65 6C 6C 6F' },
  { id: 'binary', name: 'Binary', code: '01', description: '8비트 이진수 바이트를 UTF-8 텍스트로 변환합니다.', sample: '01001000 01100101 01101100 01101100 01101111', placeholder: '01001000 01101001' },
  { id: 'json', name: 'JSON 문자열', code: '{}', description: 'JSON 문자열의 이스케이프를 해석합니다.', sample: '"Hello\\n\\uC548\\uB155"', placeholder: '"Hello\\nworld"' },
  { id: 'jwt', name: 'JWT / 토큰', code: 'JWT', description: '3부분 JWT의 Header와 Payload, 또는 2부분 토큰의 첫 JSON을 표시합니다.', sample: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.', placeholder: 'header.payload.signature 또는 payload.signature' },
];

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="decode 홈"><span class="brand-mark">d<span>.</span></span><span>decode</span></a>
      <span class="top-note"><span class="status-dot"></span> 브라우저에서 바로 처리</span>
    </header>

    <main>
      <div class="intro">
        <div class="eyebrow"><span class="eyebrow-line"></span> TEXT UTILITY / 001</div>
        <h1>복잡한 문자를<br><em>읽을 수 있는 텍스트로.</em></h1>
        <p>인코딩된 문자열을 붙여넣으세요. 형식을 고르면 결과가 바로 나타납니다.</p>
      </div>

      <section class="workspace" aria-label="디코더 작업 공간">
        <div class="workspace-heading"><div><span class="section-kicker">01 / FORMAT</span><h2>디코딩 형식</h2></div><span class="format-count">08 FORMATS</span></div>
        <div class="format-grid" role="group" aria-label="디코딩 형식"></div>

        <div class="editor-heading"><div><span class="section-kicker">02 / WORKSPACE</span><h2>변환하기</h2></div><span class="keyboard-hint">입력 즉시 변환</span></div>
        <div class="editor-grid">
          <section class="editor-panel input-panel" aria-labelledby="input-title">
            <div class="panel-top"><div><span class="panel-index">IN / 01</span><h3 id="input-title">입력</h3></div><button class="text-button" id="sample-button" type="button">예시 넣기 <span aria-hidden="true">↗</span></button></div>
            <textarea id="input" spellcheck="false" aria-label="디코딩할 텍스트"></textarea>
            <div class="panel-bottom"><span id="input-count">0 문자</span><button class="text-button" id="clear-button" type="button">모두 지우기</button></div>
          </section>
          <div class="arrow" aria-hidden="true">→</div>
          <section class="editor-panel output-panel" aria-labelledby="output-title">
            <div class="panel-top"><div><span class="panel-index">OUT / 02</span><h3 id="output-title">결과</h3></div><button class="copy-button" id="copy-button" type="button" disabled>복사하기 <span aria-hidden="true">⧉</span></button></div>
            <pre id="output" class="output empty" aria-live="polite">여기에 디코딩 결과가 표시됩니다.</pre>
            <div class="panel-bottom"><span id="result-status"><span class="small-dot"></span> 입력을 기다리는 중</span><span id="output-count">0 문자</span></div>
          </section>
        </div>
        <div class="format-help" id="format-help"></div>
      </section>
    </main>

    <footer><span>decode <span class="footer-spark">✳</span> 간단한 텍스트 도구</span><span>텍스트는 브라우저 안에서 처리됩니다.</span></footer>
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
let selected = 'url';
let decoded = '';

for (const format of formats) {
  const button = document.createElement('button');
  button.className = 'format-card';
  button.type = 'button';
  button.dataset.format = format.id;
  button.setAttribute('aria-pressed', String(format.id === selected));
  button.innerHTML = `<span class="format-code"></span><span class="format-name"></span><span class="format-arrow" aria-hidden="true">↗</span>`;
  button.querySelector('.format-code').textContent = format.code;
  button.querySelector('.format-name').textContent = format.name;
  button.addEventListener('click', () => {
    selected = format.id;
    grid.querySelectorAll('.format-card').forEach((card) => card.setAttribute('aria-pressed', String(card === button)));
    updateFormat();
    updateResult();
  });
  grid.append(button);
}

function updateFormat() {
  const format = formats.find((item) => item.id === selected);
  input.placeholder = format.placeholder;
  help.textContent = format.description + (selected === 'jwt' ? ' 서명은 검증하지 않습니다.' : '');
}

function updateResult() {
  inputCount.textContent = `${[...input.value].length} 문자`;
  output.classList.remove('error');
  if (!input.value) {
    decoded = '';
    output.textContent = '여기에 디코딩 결과가 표시됩니다.';
    output.classList.add('empty');
    status.innerHTML = '<span class="small-dot"></span> 입력을 기다리는 중';
  } else {
    try {
      decoded = decoders[selected](input.value);
      output.textContent = decoded || '빈 결과입니다.';
      output.classList.toggle('empty', !decoded);
      status.innerHTML = '<span class="small-dot success"></span> 디코딩 완료';
    } catch (error) {
      decoded = '';
      output.textContent = error.message;
      output.classList.remove('empty');
      output.classList.add('error');
      status.innerHTML = '<span class="small-dot failure"></span> 형식을 확인해 주세요';
    }
  }
  outputCount.textContent = `${[...decoded].length} 문자`;
  copyButton.disabled = !decoded;
  if (copyButton.dataset.copied === 'true') {
    copyButton.innerHTML = '복사하기 <span aria-hidden="true">⧉</span>';
    copyButton.dataset.copied = 'false';
  }
}

input.addEventListener('input', updateResult);
app.querySelector('#sample-button').addEventListener('click', () => {
  input.value = formats.find((item) => item.id === selected).sample;
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
    copyButton.innerHTML = '복사됨 <span aria-hidden="true">✓</span>';
    copyButton.dataset.copied = 'true';
  } catch {
    status.textContent = '클립보드 접근에 실패했습니다.';
  }
});

updateFormat();
updateResult();
