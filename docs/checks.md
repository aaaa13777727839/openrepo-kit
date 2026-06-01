# Audit Checks

`openrepo-kit` focuses on repository practices that make open-source projects easier to evaluate, run, and contribute to.

| Check | Weight | Why it matters |
| --- | ---: | --- |
| README | 18 | Helps visitors understand the project, install it, and decide whether to contribute. |
| License | 14 | Makes reuse rights explicit for individuals and organizations. |
| Contributing guide | 10 | Turns drive-by interest into useful issues and pull requests. |
| Code of conduct | 8 | Sets community expectations before conflict appears. |
| Security policy | 8 | Gives reporters a private disclosure path. |
| Continuous integration | 14 | Makes pull requests safer to review and merge. |
| Tests | 12 | Gives maintainers confidence when behavior changes. |
| Git ignore rules | 6 | Keeps local, generated, and sensitive files out of history. |
| Issue templates | 5 | Improves bug reports and feature requests. |
| Pull request template | 5 | Nudges contributors to include context and testing notes. |

## Design Principles

- Prefer checks that are easy for maintainers to act on.
- Avoid judging project popularity or code style.
- Keep generated files boring, readable, and safe to edit.
- Make CI usage possible without external services.
