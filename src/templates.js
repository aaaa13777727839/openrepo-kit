import { promises as fs } from "node:fs";
import path from "node:path";

export async function buildTemplates(root) {
  const projectName = await inferProjectName(root);
  const year = new Date().getFullYear();

  return [
    {
      path: "README.md",
      content: readmeTemplate(projectName)
    },
    {
      path: "LICENSE",
      content: mitLicenseTemplate(year)
    },
    {
      path: "CONTRIBUTING.md",
      content: contributingTemplate(projectName)
    },
    {
      path: "CODE_OF_CONDUCT.md",
      content: codeOfConductTemplate()
    },
    {
      path: "SECURITY.md",
      content: securityTemplate()
    },
    {
      path: ".gitignore",
      content: gitignoreTemplate()
    },
    {
      path: ".editorconfig",
      content: editorconfigTemplate()
    },
    {
      path: ".github/workflows/ci.yml",
      content: ciTemplate()
    },
    {
      path: ".github/ISSUE_TEMPLATE/bug_report.yml",
      content: bugTemplate()
    },
    {
      path: ".github/ISSUE_TEMPLATE/feature_request.yml",
      content: featureTemplate()
    },
    {
      path: ".github/pull_request_template.md",
      content: pullRequestTemplate()
    }
  ];
}

async function inferProjectName(root) {
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(root, "package.json"), "utf8")
    );
    if (typeof packageJson.name === "string" && packageJson.name.trim()) {
      return packageJson.name.trim();
    }
  } catch {
    // Fall through to the directory name.
  }

  return path.basename(root);
}

function readmeTemplate(projectName) {
  return `# ${projectName}

Short description of what this project does and who it helps.

## Why

- Clear problem the project solves.
- Practical use cases for maintainers and contributors.
- Small scope that is easy to understand and improve.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm test
\`\`\`

## Development

\`\`\`bash
npm install
npm test
\`\`\`

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before sending a change.

## License

MIT
`;
}

function mitLicenseTemplate(year) {
  return `MIT License

Copyright (c) ${year}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

function contributingTemplate(projectName) {
  return `# Contributing to ${projectName}

Thanks for taking time to improve this project.

## Local Setup

\`\`\`bash
npm install
npm test
\`\`\`

## Pull Requests

- Keep changes focused and easy to review.
- Add or update tests for behavior changes.
- Update documentation when commands, options, or outputs change.
- Link related issues when possible.

## Issues

Helpful issues include:

- What you expected to happen.
- What actually happened.
- Steps or sample input that reproduce the problem.
- Your operating system and runtime version.
`;
}

function codeOfConductTemplate() {
  return `# Code of Conduct

## Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone.

## Expected Behavior

- Use welcoming and inclusive language.
- Respect different viewpoints and experiences.
- Accept constructive feedback gracefully.
- Focus on what is best for the community.

## Unacceptable Behavior

- Harassment, insults, or discriminatory language.
- Publishing private information without permission.
- Other conduct that would reasonably be considered inappropriate in a professional setting.

## Enforcement

Project maintainers may remove comments, commits, code, issues, or other contributions that do not align with this code of conduct.
`;
}

function securityTemplate() {
  return `# Security Policy

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Instead, email the maintainers or use GitHub private vulnerability reporting if it is enabled for this repository. Include:

- A description of the vulnerability.
- Steps to reproduce it.
- Potential impact.
- Any suggested fix.

We will acknowledge reports as soon as practical and coordinate a fix before public disclosure.
`;
}

function gitignoreTemplate() {
  return `node_modules/
coverage/
dist/
.env
.env.*
!.env.example
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
`;
}

function editorconfigTemplate() {
  return `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`;
}

function ciTemplate() {
  return `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run lint
`;
}

function bugTemplate() {
  return `name: Bug report
description: Report something that is broken or surprising.
title: "[Bug]: "
labels: ["bug"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What happened?
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: Include commands, inputs, or a small example.
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
  - type: input
    id: version
    attributes:
      label: Version
      description: Package version, commit SHA, or branch.
`;
}

function featureTemplate() {
  return `name: Feature request
description: Suggest an improvement or new capability.
title: "[Feature]: "
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What problem would this solve?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposal
      description: What would you like to happen?
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
`;
}

function pullRequestTemplate() {
  return `## Summary

- 

## Testing

- [ ] Tests added or updated
- [ ] Documentation updated
- [ ] \`npm test\` passes locally
`;
}
