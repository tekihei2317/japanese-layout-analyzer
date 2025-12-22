# Repository Guidelines

## Project Structure & Module Organization

- `README.md` is minimal; project intent and current scope live in `docs/design.md`.
- `docs/` contains design notes and references for the planned site and CLI.
- `tasks/` holds numbered task plans (e.g., `tasks/003-typing-game.md`) that describe intended features.
- There is no `src/` yet; code will land here once implementation starts.

## Build, Test, and Development Commands

- No build or test tooling is configured yet.
- If you add a build system (e.g., `npm`, `pnpm`, or `make`), document the exact commands in `README.md` and update this file.
- Example pattern to follow once tooling exists:
  - `npm run dev` — start the local dev server.
  - `npm test` — run the test suite.

## Coding Style & Naming Conventions

- Markdown files should use ATX headings (`#`, `##`) and fenced code blocks with language tags.
- Keep filenames descriptive and lowercase; follow the existing numeric prefix for task files (e.g., `tasks/006-new-feature.md`).
- When adding code, adopt the formatter and linting defaults of the chosen framework/language, then document them here.

## Testing Guidelines

- No testing framework or coverage requirements are defined yet.
- If you introduce tests, place them alongside the relevant module or in a dedicated `tests/` directory and state the convention.
- Include a short “how to run tests” note in `README.md` and update this file.

## Commit & Pull Request Guidelines

- Git history uses short, descriptive messages (often Japanese). Keep commits concise and outcome-focused.
- Prefer one logical change per commit; avoid mixing refactors with feature work.
- Pull requests should include:
  - A brief summary of scope and rationale.
  - Links to any related task file in `tasks/`.
  - Screenshots or recordings for UI changes (static pages or mockups).

## Security & Configuration Notes

- This project is currently static and local-only; avoid introducing secrets into the repo.
- If future work requires external corpora or layout data, document sources and licensing in `docs/`.
