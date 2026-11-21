# playwright-qa-sample

A small Playwright + TypeScript test suite that shows how I structure UI and API automation:
page objects, contract-style API checks, parallel execution, traces on failure, and a CI pipeline.

| Layer | Target | What it covers |
|---|---|---|
| UI | [Playwright TodoMVC demo](https://demo.playwright.dev/todomvc) | add / complete / filter / delete flows, empty-input guard |
| API | [JSONPlaceholder](https://jsonplaceholder.typicode.com) | status codes, response contract, filtering, create, 404 handling |

Both targets are public demo services, so the suite runs anywhere with no setup beyond Node.

## Run it

```bash
npm install
npx playwright install chromium
npm test              # everything
npm run test:ui       # UI project only
npm run test:api      # API project only
npm run report        # open the HTML report
```

Override targets with `UI_BASE_URL` and `API_BASE_URL`.

## Test strategy (short version)

- **Risk first.** The UI tests cover the user journeys where a regression hurts most (create, complete, filter, clear). They are not an exhaustive click-through.
- **Test at the cheapest layer.** Data and contract checks live in the API project, which runs in milliseconds; the browser is used only for behaviour a user sees.
- **Stable by design.** Locators use roles, placeholders and test ids (no CSS chains), assertions are web-first (auto-waiting), and tests share no state, so they run fully in parallel.
- **Debuggable failures.** Screenshots on failure and a trace on first retry, uploaded as a CI artifact.
- **Quality gate.** GitHub Actions runs the suite on every pull request; retries are enabled in CI only, so a flaky test is retried but still shows up in the report.

## Layout

```
pages/                 page objects (selectors live here, not in tests)
tests/ui/              browser tests
tests/api/             API tests using Playwright's request fixture
.github/workflows/     CI pipeline
playwright.config.ts   projects, retries, reporters, base URLs
```

## Notes

- JSONPlaceholder echoes writes but does not persist them, so the POST test asserts the echo and status only.
- `package-lock.json` is committed and CI installs with `npm ci`, so every run uses the same dependency versions.
- `UI_BASE_URL` always gets a trailing slash and the page object navigates to `./`. The app lives under `/todomvc/`; `goto('/')` would resolve to the host root, which is a 404.
