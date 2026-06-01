# Badge Suggestions

`openrepo-kit badges` prints README badge snippets based on local repository metadata.

It looks for:

- GitHub remote URL from `remote.origin.url`.
- First GitHub Actions workflow under `.github/workflows`.
- License metadata from `package.json` or `LICENSE`.
- Node.js runtime metadata from `package.json`.

## Usage

```bash
openrepo-kit badges .
```

Machine-readable output:

```bash
openrepo-kit badges . --json
```

Save suggestions to a file:

```bash
openrepo-kit badges . --output openrepo-badges.md
```

## Example

```text
OpenRepo Kit badges: /path/to/project
Repository: owner/repo

Suggested README badges:

- CI: Shows whether pull request and main-branch checks are passing.
[![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/repo/actions/workflows/ci.yml)

- Latest release: Gives visitors a clear signal that releases exist.
[![Latest release](https://img.shields.io/github/v/release/owner/repo)](https://github.com/owner/repo/releases/latest)
```

The command does not edit files. Copy the badge lines you want into your README.
