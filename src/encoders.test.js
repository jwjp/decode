import test from 'node:test';
import assert from 'node:assert/strict';
import { encoders } from './encoders.js';
import { decoders } from './decoders.js';

test('encoding matches each supported text format', () => {
  assert.equal(encoders.url('한 글 &'), '%ED%95%9C+%EA%B8%80+%26');
  assert.equal(encoders.unicode('한\\\n😀'), '\\uD55C\\u005C\\u000A\\u{1F600}');
  assert.equal(encoders.base64('한글'), '7ZWc6riA');
  assert.equal(encoders.html(`<a title="it's & fine">`), '&lt;a title=&quot;it&#39;s &amp; fine&quot;&gt;');
  assert.equal(encoders.hex('한'), 'ED 95 9C');
  assert.equal(encoders.binary('Hi'), '01001000 01101001');
  assert.equal(encoders.json('Hello\n한글'), '"Hello\\n한글"');
});

test('encoded text decodes back to the original, including Unicode and controls', () => {
  const original = '한 글 😀 & < > " \' \\ \\u0041\n';
  for (const format of Object.keys(encoders).filter((format) => format !== 'html')) {
    assert.equal(decoders[format](encoders[format](original)), original, format);
  }
});
