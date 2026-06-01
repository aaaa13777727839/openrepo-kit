# openrepo-kit

`openrepo-kit` is a zero-dependency CLI that audits and bootstraps GitHub-ready open-source repositories.

It helps maintainers answer a simple question: "Is this repository friendly enough for strangers to understand, trust, run, and contribute to?"

## Features

- Scores repository readiness across README, license, contribution docs, security policy, CI, tests, issue templates, and pull request template.
- Generates missing open-source starter files without overwriting existing work by default.
- Supports JSON output for automation.
- Runs on Node.js with no runtime dependencies.

## Installation

Use it directly:

```bash
npx openrepo-kit audit .
```

Or install it in a project:

```bash
npm install --save-dev openrepo-kit
```

## Usage

Audit a repository:

```bash
openrepo-kit audit .
```

Generate missing files:

```bash
openrepo-kit init .
```

Preview generated files first:

```bash
openrepo-kit init . --dry-run
```

Overwrite existing starter files:

```bash
openrepo-kit init . --force
```

Get machine-readable output:

```bash
openrepo-kit audit . --json
```

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

## Development

```bash
npm install
npm test
npm run lint
node bin/openrepo-kit.js audit .
```

## Roadmap

- Language-aware templates for Python, Rust, Go, and JavaScript packages.
- Optional SPDX license selection.
- Badge generation for README files.
- SARIF or GitHub Step Summary output for CI use.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT
