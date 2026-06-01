# npm Publishing

`openrepo-kit` is prepared for npm distribution so maintainers can install it with the shortest possible command.

## Install After Publishing

```bash
npm install --save-dev openrepo-kit
npx openrepo-kit audit . --markdown
```

Global install:

```bash
npm install -g openrepo-kit
openrepo-kit audit .
```

## Publish Checklist

Before publishing:

```bash
npm test
npm run lint
npm run pack:check
```

Authenticate:

```bash
npm login
```

Publish:

```bash
npm run release:npm
```

## Package Contents

The package intentionally ships only runtime files and user-facing docs:

- `bin/`
- `src/`
- `docs/`
- `examples/`
- `action.yml`
- `README.md`
- `LICENSE`

Tests and GitHub workflow files stay out of the package tarball.
