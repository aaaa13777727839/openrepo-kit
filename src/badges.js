import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function suggestBadges(targetPath = ".") {
  const root = path.resolve(targetPath);
  const [packageJson, repository, workflow] = await Promise.all([
    readPackageJson(root),
    detectGitHubRepository(root),
    findWorkflow(root)
  ]);

  const badges = [];
  const license = await detectLicense(root, packageJson);

  if (repository && workflow) {
    badges.push({
      id: "ci",
      title: "CI",
      markdown: `[![CI](https://github.com/${repository.owner}/${repository.name}/actions/workflows/${workflow}/badge.svg)](https://github.com/${repository.owner}/${repository.name}/actions/workflows/${workflow})`,
      reason: "Shows whether pull request and main-branch checks are passing."
    });
  }

  if (repository) {
    badges.push(
      {
        id: "release",
        title: "Latest release",
        markdown: `[![Latest release](https://img.shields.io/github/v/release/${repository.owner}/${repository.name})](https://github.com/${repository.owner}/${repository.name}/releases/latest)`,
        reason: "Gives visitors a clear signal that releases exist."
      },
      {
        id: "release-downloads",
        title: "Release downloads",
        markdown: `[![Release downloads](https://img.shields.io/github/downloads/${repository.owner}/${repository.name}/total)](https://github.com/${repository.owner}/${repository.name}/releases)`,
        reason: "Surfaces package download activity once people start trying releases."
      }
    );
  }

  if (license) {
    badges.push({
      id: "license",
      title: "License",
      markdown: `[![License: ${license}](https://img.shields.io/badge/license-${encodeBadgeValue(license)}-green.svg)](LICENSE)`,
      reason: "Makes reuse permissions visible without scrolling."
    });
  }

  if (packageJson?.engines?.node) {
    badges.push({
      id: "node",
      title: "Node.js",
      markdown: `[![Node.js](https://img.shields.io/badge/node-${encodeBadgeValue(packageJson.engines.node)}-brightgreen.svg)](package.json)`,
      reason: "Shows the supported runtime before installation."
    });
  }

  return {
    path: root,
    repository,
    badges
  };
}

export function parseGitHubRemote(value) {
  if (!value) return null;

  const patterns = [
    /^https:\/\/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/,
    /^git@github\.com:([^/]+)\/([^/.]+?)(?:\.git)?$/,
    /^ssh:\/\/git@github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/
  ];

  for (const pattern of patterns) {
    const match = value.trim().match(pattern);
    if (match) {
      return {
        owner: match[1],
        name: match[2]
      };
    }
  }

  return null;
}

async function detectGitHubRepository(root) {
  try {
    const { stdout } = await execFileAsync("git", [
      "-C",
      root,
      "config",
      "--get",
      "remote.origin.url"
    ]);
    return parseGitHubRemote(stdout);
  } catch {
    return null;
  }
}

async function findWorkflow(root) {
  const workflowDir = path.join(root, ".github", "workflows");

  try {
    const entries = await fs.readdir(workflowDir);
    return entries.find((entry) => /\.(ya?ml)$/i.test(entry)) ?? null;
  } catch {
    return null;
  }
}

async function readPackageJson(root) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  } catch {
    return null;
  }
}

async function detectLicense(root, packageJson) {
  if (typeof packageJson?.license === "string" && packageJson.license.trim()) {
    return packageJson.license.trim();
  }

  try {
    const license = await fs.readFile(path.join(root, "LICENSE"), "utf8");
    if (/MIT License/i.test(license)) return "MIT";
    if (/Apache License/i.test(license)) return "Apache-2.0";
    if (/GNU GENERAL PUBLIC LICENSE/i.test(license)) return "GPL";
  } catch {
    // No readable license file.
  }

  return null;
}

function encodeBadgeValue(value) {
  return encodeURIComponent(value).replaceAll("-", "--");
}
