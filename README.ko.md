# decode

브라우저에서 텍스트를 인코딩하거나 디코딩할 수 있는 오픈소스 도구입니다. 입력한 텍스트는 서버로 전송하지 않고 브라우저 안에서 처리합니다.

**바로 사용하기:** https://jwjp.github.io/decode/

첫 방문 시 영어로 표시됩니다. 화면 위쪽의 **EN / 한국어** 버튼으로 언어를 바꿀 수 있으며, 선택한 언어는 브라우저에 저장됩니다. [English README](README.md)

## 지원 형식

| 형식 | 디코딩 예시 | 인코딩 지원 |
| --- | --- | --- |
| URL | `%ED%95%9C+%EA%B8%80` | 퍼센트 인코딩, 공백은 `+`로 표시 |
| Unicode | `\uD55C\uAE00` | 비 ASCII 문자, 제어 문자, 역슬래시를 이스케이프 |
| Base64 | `7ZWc6riA` | UTF-8 텍스트를 Base64로 변환 |
| HTML 엔티티 | `&lt;div&gt;` | `&`, `<`, `>`, 따옴표, 작은따옴표 이스케이프 |
| Hex | `48 65 6C 6C 6F` | UTF-8 바이트를 16진수로 변환 |
| Binary | `01001000 01101001` | UTF-8 바이트를 8비트 이진수로 변환 |
| JSON 문자열 | `"Hello\nworld"` | 텍스트를 JSON 문자열로 이스케이프 |
| JWT / 토큰 | `header.payload.signature`, `payload.signature` | 디코딩 전용. 3부분 JWT는 Header와 Payload, 2부분 토큰은 첫 JSON 표시. 서명은 검증하지 않음. |

**Decode / Encode** 스위치로 변환 방향을 선택할 수 있습니다. JWT 인코딩은 사용 가능한 토큰을 만들려면 서명이 필요하므로 제공하지 않습니다.

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

`dist/` 폴더에 정적 사이트가 생성됩니다. `main`에 푸시하면 GitHub Pages에 배포됩니다.

## 기여

버그 제보와 기능 제안, Pull Request를 환영합니다. [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 라이선스

MIT. [LICENSE](LICENSE)를 참고하세요.
