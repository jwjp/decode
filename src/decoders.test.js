import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeUrl, decodeUnicode, decodeBase64, decodeHex, decodeBinary, decodeJsonString, decodeJwt } from './decoders.js';

test('URL decoding: UTF-8, plus signs, and invalid percent escapes', () => {
  assert.equal(decodeUrl('%ED%95%9C+%EA%B8%80'), '한 글');
  assert.throws(() => decodeUrl('%ZZ'), { code: 'invalidUrl' });
});

test('Unicode decoding: BMP, surrogate pairs, and code points', () => {
  assert.equal(decodeUnicode('\\uD55C\\uAE00 \\uD83D\\uDE00 \\u{1F44B}'), '한글 😀 👋');
  assert.throws(() => decodeUnicode('\\u{110000}'), { code: 'invalidCodePoint' });
  assert.throws(() => decodeUnicode('\\uD83D'), { code: 'unpairedSurrogate' });
});

test('Base64 and Base64URL decoding: UTF-8 and invalid input', () => {
  assert.equal(decodeBase64('7ZWc6riA'), '한글');
  assert.equal(decodeBase64('8J-agA'), '🚀');
  assert.throws(() => decodeBase64('%%%'), { code: 'invalidBase64' });
  assert.throws(() => decodeBase64('//8='), { code: 'invalidUtf8' });
});

test('Hex and binary decoding: UTF-8 bytes', () => {
  assert.equal(decodeHex('0xED 0x95 0x9C'), '한');
  assert.equal(decodeBinary('11101101 10010101 10011100'), '한');
  assert.throws(() => decodeHex('ABC'), { code: 'invalidHex' });
  assert.throws(() => decodeBinary('101'), { code: 'invalidBinary' });
});

test('JSON string and token decoding', () => {
  assert.equal(decodeJsonString('"Hello\\nworld"'), 'Hello\nworld');
  assert.throws(() => decodeJsonString('{"a":1}'), { code: 'invalidJsonString' });
  const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.';
  assert.match(decodeJwt(token), /"name": "Jane Doe"/);
  assert.deepEqual(JSON.parse(decodeJwt('eyJmb28iOiJiYXIifQ.c2lnbmF0dXJl')), { foo: 'bar' });
  assert.throws(() => decodeJwt('bad.token'), { code: 'invalidTokenJson' });
  assert.throws(() => decodeJwt('one'), { code: 'invalidTokenParts' });
});
