# Continuous Integration

Use `openrepo-kit` in CI when you want repository health checks to be visible in pull requests.

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
