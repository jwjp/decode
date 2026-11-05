# decode

An open-source text encoder and decoder that runs in your browser. Your input is processed locally and is not sent to a server.

**Try it:** https://jwjp.github.io/decode/

English is the default language. Use the **EN / 한국어** switch to change languages; your choice is saved in this browser. [한국어 문서](README.ko.md)

## Supported formats

| Format | Decode example | Encode support |
| --- | --- | --- |
| URL | `%ED%95%9C+%EA%B8%80` | Percent encoding; spaces become `+` |
| Unicode | `\uD55C\uAE00` | Escapes non-ASCII characters, controls, and backslashes |
| Base64 | `7ZWc6riA` | Encodes UTF-8 text as Base64 |
| HTML entities | `&lt;div&gt;` | Escapes `&`, `<`, `>`, quotes, and apostrophes |
| Hex | `48 65 6C 6C 6F` | Encodes UTF-8 bytes as hexadecimal pairs |
| Binary | `01001000 01101001` | Encodes UTF-8 bytes as 8-bit groups |
| JSON string | `"Hello\nworld"` | Quotes and escapes text as a JSON string |
| JWT / token | `header.payload.signature`, `payload.signature` | Decode only. Shows the header and payload of a 3-part JWT, or the first JSON object of a 2-part token. Does not verify signatures. |

Use the **Decode / Encode** switch to choose a direction. JWT is available only in Decode because encoding a usable JWT requires signing.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test
npm run build
```

The static site is generated in `dist/` and is deployed to GitHub Pages on pushes to `main`.

## Contributing

Bug reports, feature requests, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
