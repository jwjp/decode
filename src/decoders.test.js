import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeUrl, decodeUnicode, decodeBase64, decodeHex, decodeBinary, decodeJsonString, decodeJwt } from './decoders.js';

test('URL 디코딩: UTF-8, plus 및 잘못된 percent escape', () => {
  assert.equal(decodeUrl('%ED%95%9C+%EA%B8%80'), '한 글');
  assert.throws(() => decodeUrl('%ZZ'), /잘못된 URL/);
});

test('Unicode 디코딩: BMP, surrogate pair, code point', () => {
  assert.equal(decodeUnicode('\\uD55C\\uAE00 \\uD83D\\uDE00 \\u{1F44B}'), '한글 😀 👋');
  assert.throws(() => decodeUnicode('\\u{110000}'), /유효하지 않은/);
  assert.throws(() => decodeUnicode('\\uD83D'), /서로게이트/);
});

test('Base64와 Base64URL 디코딩: UTF-8과 오류 처리', () => {
  assert.equal(decodeBase64('7ZWc6riA'), '한글');
  assert.equal(decodeBase64('8J-agA'), '🚀');
  assert.throws(() => decodeBase64('%%%'), /Base64/);
  assert.throws(() => decodeBase64('//8='), /UTF-8/);
});

test('Hex와 Binary 디코딩: UTF-8 바이트', () => {
  assert.equal(decodeHex('0xED 0x95 0x9C'), '한');
  assert.equal(decodeBinary('11101101 10010101 10011100'), '한');
  assert.throws(() => decodeHex('ABC'), /16진수/);
  assert.throws(() => decodeBinary('101'), /2진수/);
});

test('JSON 문자열과 JWT 디코딩', () => {
  assert.equal(decodeJsonString('"Hello\\nworld"'), 'Hello\nworld');
  assert.throws(() => decodeJsonString('{"a":1}'), /JSON 문자열/);
  const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.';
  assert.match(decodeJwt(token), /"name": "Jane Doe"/);
  assert.throws(() => decodeJwt('bad-token'), /JWT/);
});
