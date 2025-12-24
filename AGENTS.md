# Repository Guidelines

## Project Structure & Module Organization

- `cli/`, `core/`, `web/` are Bun workspaces. `web/` is the Astro frontend, `core/` holds conversion logic and layout data, `cli/` is a thin consumer.
- `web/src/typing/` contains the typing game UI and hooks; keep typing-related UI and state there.
- `layouts/` stores TSV sources for roman tables. Generated JSON lives in `core/layouts/`.
- `scripts/` contains Bun scripts that transform layout data (see commands below).
- `typing-keyboard-layout-wiki/` and `docs/` are reference material; `tasks/` tracks numbered task specs.

## Build, Test, and Development Commands

- `bun run web:dev` - start the Astro dev server for `web/`.
- `bun run web:build` - build the static site.
- `bun run layouts:build` - convert all `layouts/*.tsv` into `core/layouts/*.json`.
- `bun run layouts:onishi` - regenerate `layouts/oonisi.tsv` from the Qwerty table.

## Coding Style & Naming Conventions

- TypeScript is `strict` (see `tsconfig.json`), with `ES2022` targets and `Bundler` module resolution.
- Match existing formatting in the file you touch; prefer small, readable components and hooks.
- Layout IDs should match JSON filenames (e.g., `oonisi`, `yukika`) and stay consistent across `core/` and `web/`.
- Keep Markdown docs concise; use ATX headings and language-tagged fences.

## Testing Guidelines

- No formal test runner is configured. If you add tests, document how to run them and the directory convention you chose.

## Commit & Pull Request Guidelines

- Commit messages are short and descriptive (often Japanese). Keep one logical change per commit.
- PRs should include a brief scope summary, links to relevant `tasks/*.md`, and screenshots for UI changes.

## Security & Configuration Notes

- Do not commit secrets. If you add external datasets or layout sources, record provenance and licensing in `docs/`.
