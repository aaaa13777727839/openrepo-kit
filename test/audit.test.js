import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditRepository, gradeScore } from "../src/audit.js";

test("gradeScore returns expected letter grades", () => {
  assert.equal(gradeScore(95), "A");
  assert.equal(gradeScore(85), "B");
  assert.equal(gradeScore(75), "C");
  assert.equal(gradeScore(60), "D");
  assert.equal(gradeScore(10), "F");
});

test("auditRepository reports missing open-source basics", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-audit-"));
  const report = await auditRepository(root);

  assert.equal(report.score, 0);
  assert.equal(report.failed, 10);
  assert.equal(report.checks.find((check) => check.id === "readme").passed, false);
});

test("auditRepository recognizes a prepared repository", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-ready-"));

  await fs.mkdir(path.join(root, ".github", "workflows"), { recursive: true });
  await fs.mkdir(path.join(root, ".github", "ISSUE_TEMPLATE"), { recursive: true });
  await fs.mkdir(path.join(root, "test"), { recursive: true });

  await Promise.all([
    fs.writeFile(path.join(root, "README.md"), "# Demo\n"),
    fs.writeFile(path.join(root, "LICENSE"), "MIT\n"),
    fs.writeFile(path.join(root, "CONTRIBUTING.md"), "# Contributing\n"),
    fs.writeFile(path.join(root, "CODE_OF_CONDUCT.md"), "# Code\n"),
    fs.writeFile(path.join(root, "SECURITY.md"), "# Security\n"),
    fs.writeFile(path.join(root, ".gitignore"), "node_modules/\n"),
    fs.writeFile(path.join(root, ".github", "workflows", "ci.yml"), "name: CI\n"),
    fs.writeFile(path.join(root, ".github", "ISSUE_TEMPLATE", "bug.yml"), "name: Bug\n"),
    fs.writeFile(path.join(root, ".github", "pull_request_template.md"), "## Summary\n"),
    fs.writeFile(path.join(root, "test", "demo.test.js"), "export {};\n")
  ]);

  const report = await auditRepository(root);

  assert.equal(report.score, 100);
  assert.equal(report.failed, 0);
});
