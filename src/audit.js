import { promises as fs } from "node:fs";
import path from "node:path";

const CHECKS = [
  {
    id: "readme",
    title: "README",
    weight: 18,
    files: ["README.md", "readme.md"],
    fix: "Add a README with install, usage, contributing, and license sections."
  },
  {
    id: "license",
    title: "License",
    weight: 14,
    files: ["LICENSE", "LICENSE.md", "COPYING"],
    fix: "Add an OSI-approved license so others know how they can use the project."
  },
  {
    id: "contributing",
    title: "Contributing guide",
    weight: 10,
    files: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md"],
    fix: "Add CONTRIBUTING.md with setup, test, issue, and pull request guidance."
  },
  {
    id: "code-of-conduct",
    title: "Code of conduct",
    weight: 8,
    files: ["CODE_OF_CONDUCT.md", ".github/CODE_OF_CONDUCT.md"],
    fix: "Add a code of conduct so community expectations are explicit."
  },
  {
    id: "security",
    title: "Security policy",
    weight: 8,
    files: ["SECURITY.md", ".github/SECURITY.md"],
    fix: "Add SECURITY.md with responsible disclosure instructions."
  },
  {
    id: "ci",
    title: "Continuous integration",
    weight: 14,
    custom: hasCiWorkflow,
    fix: "Add a GitHub Actions workflow that runs tests on every pull request."
  },
  {
    id: "tests",
    title: "Tests",
    weight: 12,
    custom: hasTests,
    fix: "Add tests or a package test script so contributors can verify changes."
  },
  {
    id: "gitignore",
    title: "Git ignore rules",
    weight: 6,
    files: [".gitignore"],
    fix: "Add .gitignore for generated files, local env files, and dependency folders."
  },
  {
    id: "issues",
    title: "Issue templates",
    weight: 5,
    custom: hasIssueTemplates,
    fix: "Add bug report and feature request templates under .github/ISSUE_TEMPLATE."
  },
  {
    id: "pull-request-template",
    title: "Pull request template",
    weight: 5,
    files: [".github/pull_request_template.md"],
    fix: "Add a pull request template with tests and review checklist prompts."
  }
];

export async function auditRepository(targetPath = ".") {
  const root = path.resolve(targetPath);
  const checks = [];

  for (const check of CHECKS) {
    const passed = check.custom
      ? await check.custom(root)
      : await anyFileExists(root, check.files);

    checks.push({
      id: check.id,
      title: check.title,
      passed,
      weight: check.weight,
      fix: passed ? null : check.fix
    });
  }

  const score = Math.round(
    checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0)
  );

  return {
    path: root,
    score,
    grade: gradeScore(score),
    checks,
    passed: checks.filter((check) => check.passed).length,
    failed: checks.filter((check) => !check.passed).length
  };
}

export function gradeScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 55) return "D";
  return "F";
}

async function anyFileExists(root, candidates) {
  const results = await Promise.all(
    candidates.map(async (candidate) => fileExists(path.join(root, candidate)))
  );
  return results.some(Boolean);
}

async function hasCiWorkflow(root) {
  const workflowsDir = path.join(root, ".github", "workflows");

  try {
    const entries = await fs.readdir(workflowsDir);
    return entries.some((entry) => /\.(ya?ml)$/i.test(entry));
  } catch {
    return false;
  }
}

async function hasIssueTemplates(root) {
  const templateDir = path.join(root, ".github", "ISSUE_TEMPLATE");

  try {
    const entries = await fs.readdir(templateDir);
    return entries.some((entry) => /\.(md|ya?ml)$/i.test(entry));
  } catch {
    return false;
  }
}

async function hasTests(root) {
  if (await directoryHasFiles(path.join(root, "test"))) return true;
  if (await directoryHasFiles(path.join(root, "tests"))) return true;

  const packageJsonPath = path.join(root, "package.json");
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const testScript = packageJson.scripts?.test;
    return typeof testScript === "string" && testScript.trim() !== "";
  } catch {
    return false;
  }
}

async function directoryHasFiles(directory) {
  try {
    const entries = await fs.readdir(directory);
    return entries.some((entry) => !entry.startsWith("."));
  } catch {
    return false;
  }
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}
