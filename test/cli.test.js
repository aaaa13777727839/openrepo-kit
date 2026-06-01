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

test("CLI audit rejects conflicting output formats", async () => {
  const error = await runCliFailure(["audit", ".", "--json", "--markdown"]);

  assert.equal(error.code, 1);
  assert.match(error.stderr, /Use either --json or --markdown/);
});

async function runCliFailure(args) {
  try {
    await execFileAsync(process.execPath, [cliPath, ...args]);
  } catch (error) {
    return error;
  }

  assert.fail("Expected CLI command to fail.");
}
