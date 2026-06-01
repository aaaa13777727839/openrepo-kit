import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { parseGitHubRemote, suggestBadges } from "../src/badges.js";

const execFileAsync = promisify(execFile);

test("parseGitHubRemote supports common GitHub remote formats", () => {
  assert.deepEqual(parseGitHubRemote("https://github.com/owner/repo.git"), {
    owner: "owner",
    name: "repo"
  });
  assert.deepEqual(parseGitHubRemote("git@github.com:owner/repo.git"), {
    owner: "owner",
    name: "repo"
  });
  assert.deepEqual(parseGitHubRemote("ssh://git@github.com/owner/repo.git"), {
    owner: "owner",
    name: "repo"
  });
  assert.equal(parseGitHubRemote("https://example.com/owner/repo.git"), null);
});

test("suggestBadges uses repository, workflow, package, and license metadata", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openrepo-badges-"));

  await fs.mkdir(path.join(root, ".github", "workflows"), { recursive: true });
  await fs.writeFile(path.join(root, ".github", "workflows", "ci.yml"), "name: CI\n");
  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ license: "MIT", engines: { node: ">=18.18" } }, null, 2)
  );

  await execFileAsync("git", ["init"], { cwd: root });
  await execFileAsync("git", [
    "remote",
    "add",
    "origin",
    "https://github.com/example/openrepo-kit.git"
  ], { cwd: root });

  const report = await suggestBadges(root);
  const badgeIds = report.badges.map((badge) => badge.id);

  assert.deepEqual(report.repository, {
    owner: "example",
    name: "openrepo-kit"
  });
  assert.ok(badgeIds.includes("ci"));
  assert.ok(badgeIds.includes("release"));
  assert.ok(badgeIds.includes("release-downloads"));
  assert.ok(badgeIds.includes("license"));
  assert.ok(badgeIds.includes("node"));
});
