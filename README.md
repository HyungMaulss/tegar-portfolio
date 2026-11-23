# Tegar Maulana · QA Engineer portfolio

**Live:** [tegarmaulana-portfolio.vercel.app](https://tegarmaulana-portfolio.vercel.app)

My portfolio as a Quality Assurance Engineer: experience, projects, and readable samples of my Cypress, Playwright, Selenium and K6 test suites with a replayed run.

React 19 + Vite. Three-tone palette from the logo, light/dark theme, EN/ID copy, a portfolio-only chat assistant, and a code viewer for the test framework samples.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm test` | Chatbot intent tests (Node built-in test runner, no extra deps) |
| `npm run lint` | ESLint |
| `npm run resume` | Rebuild `public/Tegar-Maulana-Portfolio.pptx` (7 slides, Morph transitions) from `src/data/`. Run it after changing portfolio content |
| `npm run resume:pdf` | Export that deck to `public/Tegar-Maulana-Portfolio.pdf` (Windows with PowerPoint installed). Run it after `npm run resume` |

## Where things live

```
src/
  data/
    profile.js       contact details, skill groups, which projects have source (single source of truth)
    translations.js  every visible string, EN and ID
    codeSnippets.jsx sample test code + simulated output for the code viewer
  lib/
    chatbot.js       closed-domain intent matcher: answers are built only from the data above
    chatbot.test.js  intent + off-topic refusal tests
  components/        one component + one CSS file per section (Logo.jsx is the traced brand logo)
  context/           language provider (persists choice in localStorage)
  index.css          design tokens (light/dark), base styles, shared pieces
```

To change content, edit `src/data/`. Components only render it.

## Chat assistant

There is no LLM and no API key. `src/lib/chatbot.js` scores the question against portfolio intents
(experience, projects, a named tool, contact, ...). Anything off-topic, or a request to write code,
translate, tell a joke, ignore instructions, is refused. Add new topics there and add a case to the test.
