# Contributing

Thanks for your interest in contributing. For bugs or feature ideas, open a GitHub Issue with steps to reproduce the problem and the expected result.

To contribute code, fork the repository, work on a separate branch, and open a pull request.

```bash
npm install
npm test
npm run build
```

Add new decoders as pure functions in `src/decoders.js`, then add their names, descriptions, and examples for both languages in `src/main.js`. Include tests for valid and invalid input. Decoder functions should throw errors with stable codes; map each code to English and Korean messages in the UI.

All decoding happens in the browser. Please discuss any change that would send input text to an external service in an Issue first.
