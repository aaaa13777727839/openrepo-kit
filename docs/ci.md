# Continuous Integration

Use `openrepo-kit` in CI when you want repository health checks to be visible in pull requests.

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
      - uses: aaaa13777727839/openrepo-kit@v0.5.1
        with:
          fail-under: "80"
          format: markdown
          output: openrepo-audit.md
          summary: "true"
      - uses: actions/upload-artifact@v4
        with:
          name: openrepo-audit
          path: openrepo-audit.md
```

Action inputs:

| Input | Default | Notes |
| --- | --- | --- |
| `path` | `.` | Repository path to audit. |
| `fail-under` | `80` | Fails the job when the score is lower. |
| `format` | `markdown` | Use `text`, `markdown`, or `json`. |
| `output` | `openrepo-audit.md` | Writes a report file. Set to an empty string to only print. |
| `summary` | `true` | Appends Markdown output to the GitHub Actions job summary. |

## Install From Release

```bash
npm install -g https://github.com/aaaa13777727839/openrepo-kit/releases/latest/download/openrepo-kit-latest.tgz
openrepo-kit audit . --fail-under 80
```

## Direct CLI Workflow

Until the package is published to npm, run it directly from GitHub:

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
      - run: npx github:aaaa13777727839/openrepo-kit audit . --markdown --output openrepo-audit.md
      - uses: actions/upload-artifact@v4
        with:
          name: openrepo-audit
          path: openrepo-audit.md
```

## Suggested Thresholds

| Score | Use it for |
| --- | --- |
| 70 | Early projects that want basic open-source hygiene. |
| 80 | Active projects that want contributor-friendly defaults. |
| 90 | Mature projects with stricter community and security expectations. |

## JSON Output

For dashboards or custom automation:

```bash
npx github:aaaa13777727839/openrepo-kit audit . --json
```

The JSON report includes the total score, grade, pass/fail counts, and detailed check results.

## Markdown Summary

For GitHub Actions job summaries:

```bash
npx github:aaaa13777727839/openrepo-kit audit . --markdown >> "$GITHUB_STEP_SUMMARY"
```

This creates a compact table that maintainers can read without opening logs.

## Artifact Output

For downloadable CI artifacts:

```bash
npx github:aaaa13777727839/openrepo-kit audit . --markdown --output openrepo-audit.md
```

Then upload `openrepo-audit.md` with your CI provider's artifact step.
