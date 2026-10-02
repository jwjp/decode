const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

function decodeError(code) {
  return Object.assign(new Error(code), { code });
}

function decodeUtf8(bytes) {
  try {
    return utf8Decoder.decode(bytes);
  } catch {
    throw decodeError('invalidUtf8');
  }
}

function decodeBase64Bytes(input) {
  const normalized = input.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
    throw decodeError('invalidBase64');
  }

  try {
    const binary = atob(normalized);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw decodeError('invalidBase64');
  }
}

export function decodeUrl(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch {
    throw decodeError('invalidUrl');
  }
}

export function decodeUnicode(input) {
  const invalidEscape = /\\(?:u(?![0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})|x(?![0-9a-fA-F]{2}))/;
  if (invalidEscape.test(input)) {
    throw decodeError('invalidUnicodeEscape');
  }

  const decoded = input
    .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        throw decodeError('invalidCodePoint');
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
        throw decodeError('unpairedSurrogate');
      }
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      throw decodeError('unpairedSurrogate');
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
    throw decodeError('invalidHex');
  }
  const bytes = Uint8Array.from(compact.match(/.{2}/g), (hex) => Number.parseInt(hex, 16));
  return decodeUtf8(bytes);
}

export function decodeBinary(input) {
  const compact = input.replace(/\s/g, '');
  if (!compact || compact.length % 8 !== 0 || /[^01]/.test(compact)) {
    throw decodeError('invalidBinary');
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
    throw decodeError('invalidJsonString');
  }
}

export function decodeJwt(input) {
  const parts = input.trim().split('.');
  if (![2, 3].includes(parts.length) || !parts[0] || !parts[1]) {
    throw decodeError('invalidTokenParts');
  }

  try {
    const first = JSON.parse(decodeBase64(parts[0]));
    if (first === null || typeof first !== 'object' || Array.isArray(first)) {
      throw new Error();
    }

    if (parts.length === 2) {
      return JSON.stringify(first, null, 2);
    }

    const payload = JSON.parse(decodeBase64(parts[1]));
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error();
    }
    return `${JSON.stringify(first, null, 2)}\n\n${JSON.stringify(payload, null, 2)}`;
  } catch {
    throw decodeError('invalidTokenJson');
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
