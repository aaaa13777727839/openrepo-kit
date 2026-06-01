# Continuous Integration

Use `openrepo-kit` in CI when you want repository health checks to be visible in pull requests.

## Install From Release

```bash
npm install -g https://github.com/aaaa13777727839/openrepo-kit/releases/latest/download/openrepo-kit-latest.tgz
openrepo-kit audit . --fail-under 80
```

## GitHub Action

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
