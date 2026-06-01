import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cliPath = path.resolve("bin", "openrepo-kit.js");

test("CLI audit honors --fail-under before the path", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-cli-"));

  const error = await runCliFailure(["audit", "--fail-under", "1", root]);

  assert.equal(error.code, 1);
  assert.match(error.stdout, /Score: 0\/100/);
});

test("CLI audit validates --fail-under", async () => {
  const error = await runCliFailure(["audit", ".", "--fail-under", "abc"]);

  assert.equal(error.code, 1);
  assert.match(error.stderr, /--fail-under must be an integer from 0 to 100/);
});

test("CLI audit can print Markdown", async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    cliPath,
    "audit",
    ".",
    "--markdown",
    "--fail-under",
    "100"
  ]);

  assert.match(stdout, /^# OpenRepo Kit Audit/m);
  assert.match(stdout, /\| Status \| Check \| Weight \| Fix \|/);
  assert.match(stdout, /\*\*Score:\*\* 100\/100 \(A\)/);
});

test("CLI audit can write output to a file", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-output-"));
  const outputPath = path.join(root, "reports", "audit.md");

  await execFileAsync(process.execPath, [
    cliPath,
    "audit",
    ".",
    "--markdown",
    "--output",
    outputPath,
    "--fail-under",
    "100"
  ]);

  const output = await fs.readFile(outputPath, "utf8");
  assert.match(output, /^# OpenRepo Kit Audit/m);
  assert.match(output, /\*\*Score:\*\* 100\/100 \(A\)/);
});

test("CLI badges can write output to a file", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-badges-output-"));
  const outputPath = path.join(root, "badges.txt");

  await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ license: "MIT" }));
  await execFileAsync("git", ["init"], { cwd: root });
  await execFileAsync("git", [
    "remote",
    "add",
    "origin",
    "https://github.com/example/openrepo-kit.git"
  ], { cwd: root });

  await execFileAsync(process.execPath, [
    cliPath,
    "badges",
    root,
    "--output",
    outputPath
  ]);

  const output = await fs.readFile(outputPath, "utf8");
  assert.match(output, /OpenRepo Kit badges:/);
  assert.match(output, /Latest release/);
});

test("CLI audit rejects conflicting output formats", async () => {
  const error = await runCliFailure(["audit", ".", "--json", "--markdown"]);

  assert.equal(error.code, 1);
  assert.match(error.stderr, /Use either --json or --markdown/);
});

test("CLI validates --output", async () => {
  const error = await runCliFailure(["audit", ".", "--output"]);

  assert.equal(error.code, 1);
  assert.match(error.stderr, /--output requires a file path/);
});

async function runCliFailure(args) {
  try {
    await execFileAsync(process.execPath, [cliPath, ...args]);
  } catch (error) {
    return error;
  }

  assert.fail("Expected CLI command to fail.");
}
