# openrepo-kit

[![CI](https://github.com/aaaa13777727839/openrepo-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/aaaa13777727839/openrepo-kit/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/aaaa13777727839/openrepo-kit)](https://github.com/aaaa13777727839/openrepo-kit/releases/latest)
[![Release downloads](https://img.shields.io/github/downloads/aaaa13777727839/openrepo-kit/total)](https://github.com/aaaa13777727839/openrepo-kit/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.18-brightgreen.svg)](package.json)

`openrepo-kit` is a zero-dependency CLI for maintainers who want their repositories to be easier to understand, trust, run, and contribute to.

It audits the open-source basics that make a project contributor-friendly, then safely generates the missing community files when you want a starting point.

## Why It Exists

Many useful open-source projects lose contributors before anyone opens an issue:

- The README does not explain how to run the project.
- There is no license, security policy, or contribution path.
- Pull requests do not have a clear checklist.
- CI exists in someone's head instead of in the repository.

`openrepo-kit` turns those maintenance chores into a repeatable check that can run locally or in CI.

## Quick Start

Install the latest release tarball:

```bash
npm install -g https://github.com/aaaa13777727839/openrepo-kit/releases/download/v0.2.0/openrepo-kit-0.2.0.tgz
openrepo-kit audit .
```

Run the latest version directly from GitHub:

```bash
npx github:aaaa13777727839/openrepo-kit audit .
```

Create missing starter files without overwriting existing work:

```bash
npx github:aaaa13777727839/openrepo-kit init .
```

Preview what would be created:

```bash
npx github:aaaa13777727839/openrepo-kit init . --dry-run
```

Use a minimum score in CI:

```bash
npx github:aaaa13777727839/openrepo-kit audit . --fail-under 80
```

Generate a Markdown report for pull requests or job summaries:

```bash
npx github:aaaa13777727839/openrepo-kit audit . --markdown
```

Suggest README badges from local repository metadata:

```bash
npx github:aaaa13777727839/openrepo-kit badges .
```

After the package is published to npm, the shorter `npx openrepo-kit audit .` form will work too.

## Download

- Latest release: [v0.2.0](https://github.com/aaaa13777727839/openrepo-kit/releases/tag/v0.2.0)
- Package tarball: [openrepo-kit-0.2.0.tgz](https://github.com/aaaa13777727839/openrepo-kit/releases/download/v0.2.0/openrepo-kit-0.2.0.tgz)

## Example Output

```text
OpenRepo Kit audit: /path/to/example-project
Score: 68/100 (D)

Checks:
  PASS README (18 pts)
  PASS License (14 pts)
  TODO Contributing guide (10 pts)
       Add CONTRIBUTING.md with setup, test, issue, and pull request guidance.
  TODO Code of conduct (8 pts)
       Add a code of conduct so community expectations are explicit.
  PASS Security policy (8 pts)
  PASS Continuous integration (14 pts)
  TODO Tests (12 pts)
       Add tests or a package test script so contributors can verify changes.
```

## Commands

| Command | Purpose |
| --- | --- |
| `openrepo-kit audit [path]` | Score a repository and print practical next steps. |
| `openrepo-kit audit [path] --json` | Emit machine-readable output for dashboards or bots. |
| `openrepo-kit audit [path] --markdown` | Emit a Markdown report for pull requests and CI summaries. |
| `openrepo-kit audit [path] --fail-under 80` | Fail CI if the score is below a chosen threshold. |
| `openrepo-kit badges [path]` | Suggest README badges for CI, releases, downloads, license, and runtime. |
| `openrepo-kit init [path]` | Create missing starter files only. |
| `openrepo-kit init [path] --dry-run` | Show what would be written. |
| `openrepo-kit init [path] --force` | Overwrite generated starter files when you choose to. |

## What It Checks

| Check | Why it matters |
| --- | --- |
| README | Explains what the project does and how to use it. |
| License | Makes reuse rights explicit. |
| Contributing guide | Helps contributors send useful changes. |
| Code of conduct | Sets community expectations. |
| Security policy | Gives reporters a private disclosure path. |
| CI workflow | Keeps changes verified in pull requests. |
| Tests | Makes behavior safer to change. |
| `.gitignore` | Keeps generated and local files out of history. |
| Issue templates | Improves bug and feature reports. |
| Pull request template | Nudges contributors toward reviewable changes. |

See [docs/checks.md](docs/checks.md) for the scoring model.

## GitHub Action

```yaml
name: Repository Health

on:
  pull_request:
  push:
    branches: [main]

jobs:
  openrepo-kit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx github:aaaa13777727839/openrepo-kit audit . --fail-under 80
      - run: npx github:aaaa13777727839/openrepo-kit audit . --markdown >> "$GITHUB_STEP_SUMMARY"
```

More CI notes are in [docs/ci.md](docs/ci.md).

## Generated Files

`openrepo-kit init` can create:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `.gitignore`
- `.editorconfig`
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/pull_request_template.md`

Existing files are skipped by default.

## Badge Suggestions

The `badges` command looks at your GitHub remote, workflow files, license, and package runtime metadata, then prints badge Markdown you can paste near the top of a README.

```bash
openrepo-kit badges .
```

Example:

```text
[![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/repo/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/owner/repo)](https://github.com/owner/repo/releases/latest)
[![Release downloads](https://img.shields.io/github/downloads/owner/repo/total)](https://github.com/owner/repo/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
```

## Project Status

This is an early public release. The current focus is reliable repository-health checks, safe starter-file generation, CI-friendly output, and small maintainer polish tools.

## Roadmap

- Language-aware templates for Python, Rust, Go, and JavaScript packages.
- Optional SPDX license selection.
- SARIF or GitHub Step Summary output for CI.
- Maintainer workflow helpers for issue triage and release checklists.

## Development

```bash
git clone https://github.com/aaaa13777727839/openrepo-kit.git
cd openrepo-kit
npm install
npm test
npm run lint
node bin/openrepo-kit.js audit .
```

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT
