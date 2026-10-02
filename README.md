# decode

An open-source decoder that turns encoded text into readable text in your browser. Your input is processed locally and is not sent to a server.

**Try it:** https://jwjp.github.io/decode/

English is the default language. Use the **EN / 한국어** switch to change languages; your choice is saved in this browser. [한국어 문서](README.ko.md)

## Supported formats

| Format | Example | What it does |
| --- | --- | --- |
| URL | `%ED%95%9C+%EA%B8%80` | Percent decoding; `+` becomes a space |
| Unicode | `\uD55C\uAE00` | `\uXXXX`, `\u{...}`, and `\xXX` escapes |
| Base64 | `7ZWc6riA` | Base64 and Base64URL as UTF-8 text |
| HTML entities | `&lt;div&gt;` | Named and numeric entities |
| Hex | `48 65 6C 6C 6F` | Hexadecimal bytes as UTF-8 text |
| Binary | `01001000 01101001` | 8-bit bytes as UTF-8 text |
| JSON string | `"Hello\nworld"` | Escapes in a quoted JSON string |
| JWT / token | `header.payload.signature`, `payload.signature` | Shows the header and payload of a 3-part JWT, or the first JSON object of a 2-part token. Does not verify signatures. |

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
