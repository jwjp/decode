# decode

브라우저에서 인코딩된 텍스트를 바로 읽을 수 있는 오픈소스 디코더입니다. 입력한 텍스트는 서버로 전송하지 않고 브라우저 안에서 처리합니다.

**바로 사용하기:** https://jwjp.github.io/decode/

## 지원 형식

| 형식 | 예시 | 설명 |
| --- | --- | --- |
| URL | `%ED%95%9C+%EA%B8%80` | 퍼센트 인코딩과 `+` 공백 변환 |
| Unicode | `\uD55C\uAE00` | `\uXXXX`, `\u{...}`, `\xXX` |
| Base64 | `7ZWc6riA` | Base64 및 Base64URL, UTF-8 텍스트 |
| HTML 엔티티 | `&lt;div&gt;` | 이름과 숫자 엔티티 |
| Hex | `ED 95 9C` | 16진수 바이트를 UTF-8로 변환 |
| Binary | `11101101 10010101 10011100` | 8비트 바이트를 UTF-8로 변환 |
| JSON 문자열 | `"Hello\nworld"` | JSON 문자열 이스케이프 |
| JWT / 토큰 | `header.payload.signature`, `payload.signature` | 3부분 JWT는 Header와 Payload, 2부분 토큰은 첫 JSON 표시. 서명 검증은 하지 않음 |

## 로컬 실행

Node.js 20.19+ 또는 22.12+가 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시된 로컬 주소를 여세요.

## 검사 및 빌드

```bash
npm test
npm run build
```

`dist/` 폴더에 정적 사이트가 생성됩니다. 정적 파일을 호스팅할 수 있는 곳에 배포할 수 있습니다.

## 기여

버그 제보와 기능 제안, Pull Request를 환영합니다. 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 라이선스

MIT. [LICENSE](LICENSE)를 참고하세요.
