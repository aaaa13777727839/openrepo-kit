import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { initRepository } from "../src/init.js";

test("initRepository writes starter files", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-init-"));
  const report = await initRepository(root);

  assert.ok(report.written.includes("README.md"));
  assert.ok(report.written.includes(".github/workflows/ci.yml"));
  assert.match(await fs.readFile(path.join(root, "README.md"), "utf8"), /# openrepo-init-/);
});

test("initRepository skips existing files unless force is enabled", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-skip-"));
  await fs.writeFile(path.join(root, "README.md"), "# Keep me\n");

  const skippedReport = await initRepository(root);
  assert.ok(skippedReport.skipped.includes("README.md"));
  assert.equal(await fs.readFile(path.join(root, "README.md"), "utf8"), "# Keep me\n");

  const forceReport = await initRepository(root, { force: true });
  assert.ok(forceReport.written.includes("README.md"));
  assert.match(await fs.readFile(path.join(root, "README.md"), "utf8"), /# openrepo-skip-/);
});

test("initRepository dry run does not write files", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-dry-"));
  const report = await initRepository(root, { dryRun: true });

  assert.ok(report.planned.includes("README.md"));
  await assert.rejects(fs.stat(path.join(root, "README.md")));
});
