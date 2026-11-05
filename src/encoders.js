const utf8Encoder = new TextEncoder();

function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function encodeUrl(input) {
  return encodeURIComponent(input).replace(/%20/g, '+');
}

export function encodeUnicode(input) {
  return [...input].map((character) => {
    const codePoint = character.codePointAt(0);
    if (codePoint === 0x5c || codePoint < 0x20 || codePoint > 0x7e) {
      return codePoint <= 0xffff
        ? `\\u${codePoint.toString(16).toUpperCase().padStart(4, '0')}`
        : `\\u{${codePoint.toString(16).toUpperCase()}}`;
    }
    return character;
  }).join('');
}

export function encodeBase64(input) {
  return toBase64(utf8Encoder.encode(input));
}

export function encodeHtml(input) {
  return input.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function encodeHex(input) {
  return [...utf8Encoder.encode(input)]
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

export function encodeBinary(input) {
  return [...utf8Encoder.encode(input)]
    .map((byte) => byte.toString(2).padStart(8, '0')).join(' ');
}

export function encodeJsonString(input) {
  return JSON.stringify(input);
}

export const encoders = {
  url: encodeUrl,
  unicode: encodeUnicode,
  base64: encodeBase64,
  html: encodeHtml,
  hex: encodeHex,
  binary: encodeBinary,
  json: encodeJsonString,
};
