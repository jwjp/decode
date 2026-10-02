const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

function decodeUtf8(bytes) {
  try {
    return utf8Decoder.decode(bytes);
  } catch {
    throw new Error('유효한 UTF-8 텍스트가 아닙니다.');
  }
}

function decodeBase64Bytes(input) {
  const normalized = input.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
    throw new Error('올바른 Base64 형식이 아닙니다.');
  }

  try {
    const binary = atob(normalized);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw new Error('올바른 Base64 형식이 아닙니다.');
  }
}

export function decodeUrl(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch {
    throw new Error('잘못된 URL 인코딩입니다. % 뒤의 16진수 값을 확인하세요.');
  }
}

export function decodeUnicode(input) {
  const invalidEscape = /\\(?:u(?![0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})|x(?![0-9a-fA-F]{2}))/;
  if (invalidEscape.test(input)) {
    throw new Error('Unicode 이스케이프 형식을 확인하세요. 예: \\uD55C 또는 \\u{1F600}');
  }

  const decoded = input
    .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        throw new Error('유효하지 않은 Unicode 코드 포인트입니다.');
      }
      return String.fromCodePoint(codePoint);
    })
    .replace(/(?:\\u[0-9a-fA-F]{4})+/g, (sequence) => {
      const units = [...sequence.matchAll(/\\u([0-9a-fA-F]{4})/g)]
        .map((match) => Number.parseInt(match[1], 16));
      return String.fromCharCode(...units);
    })
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));

  for (let index = 0; index < decoded.length; index += 1) {
    const unit = decoded.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = decoded.charCodeAt(++index);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new Error('짝이 맞지 않는 Unicode 서로게이트입니다.');
      }
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      throw new Error('짝이 맞지 않는 Unicode 서로게이트입니다.');
    }
  }
  return decoded;
}

export function decodeBase64(input) {
  return decodeUtf8(decodeBase64Bytes(input));
}

export function decodeHex(input) {
  const compact = input.trim().replace(/(?:0x|\\x)/gi, '').replace(/[\s,;:-]/g, '');
  if (!compact || compact.length % 2 !== 0 || /[^0-9a-f]/i.test(compact)) {
    throw new Error('16진수는 두 자리씩 입력하세요. 예: ED 95 9C');
  }
  const bytes = Uint8Array.from(compact.match(/.{2}/g), (hex) => Number.parseInt(hex, 16));
  return decodeUtf8(bytes);
}

export function decodeBinary(input) {
  const compact = input.replace(/\s/g, '');
  if (!compact || compact.length % 8 !== 0 || /[^01]/.test(compact)) {
    throw new Error('2진수는 8비트씩 입력하세요. 예: 01001000 01101001');
  }
  const bytes = Uint8Array.from(compact.match(/.{8}/g), (bits) => Number.parseInt(bits, 2));
  return decodeUtf8(bytes);
}

export function decodeJsonString(input) {
  try {
    const value = JSON.parse(input);
    if (typeof value !== 'string') throw new Error();
    return value;
  } catch {
    throw new Error('따옴표를 포함한 올바른 JSON 문자열을 입력하세요. 예: "Hello\\nworld"');
  }
}

export function decodeJwt(input) {
  const parts = input.trim().split('.');
  if (parts.length !== 3 || !parts[0] || !parts[1]) {
    throw new Error('JWT는 header.payload.signature 형식이어야 합니다.');
  }

  try {
    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));
    if (header === null || typeof header !== 'object' || payload === null || typeof payload !== 'object') {
      throw new Error();
    }
    return `${JSON.stringify(header, null, 2)}\n\n${JSON.stringify(payload, null, 2)}`;
  } catch {
    throw new Error('JWT의 header 또는 payload를 읽을 수 없습니다.');
  }
}

export function decodeHtml(input) {
  const element = document.createElement('textarea');
  element.innerHTML = input;
  return element.value;
}

export const decoders = {
  url: decodeUrl,
  unicode: decodeUnicode,
  base64: decodeBase64,
  html: decodeHtml,
  hex: decodeHex,
  binary: decodeBinary,
  json: decodeJsonString,
  jwt: decodeJwt,
};
