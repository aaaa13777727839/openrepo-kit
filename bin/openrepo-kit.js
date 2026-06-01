#!/usr/bin/env node
import { auditRepository } from "../src/audit.js";
import { suggestBadges } from "../src/badges.js";
import { initRepository } from "../src/init.js";
import {
  formatAuditReport,
  formatBadgeReport,
  formatInitReport,
  formatMarkdownAuditReport
} from "../src/report.js";

const HELP = `openrepo-kit

Audit and bootstrap GitHub-ready open-source repositories.

Usage:
  openrepo-kit audit [path] [--json] [--markdown] [--fail-under <score>]
  openrepo-kit badges [path] [--json]
  openrepo-kit init [path] [--force] [--dry-run]
  openrepo-kit help

Commands:
  audit   Score repository health and list practical fixes.
  badges  Suggest README badges from local repository metadata.
  init    Create missing README, license, community files, and CI.
  help    Show this help message.

Options:
  --json                 Print machine-readable JSON for audit.
  --markdown             Print a Markdown audit report for PRs and CI summaries.
  --fail-under <score>   Exit non-zero when the audit score is below this number.
  --force                Overwrite files during init.
  --dry-run              Show files that would be written without changing disk.
`;

const args = process.argv.slice(2);
const command = args[0] ?? "help";

try {
  if (command === "help" || command === "--help" || command === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  if (command === "audit") {
    const targetPath = readPathArg(args, ".");
    const minimumScore = readNumberOption(args, "--fail-under", 70);
    const report = await auditRepository(targetPath);

    if (args.includes("--json") && args.includes("--markdown")) {
      throw new Error("Use either --json or --markdown, not both.");
    }

    if (args.includes("--json")) {
      console.log(JSON.stringify(report, null, 2));
    } else if (args.includes("--markdown")) {
      console.log(formatMarkdownAuditReport(report));
    } else {
      console.log(formatAuditReport(report));
    }

    process.exit(report.score >= minimumScore ? 0 : 1);
  }

  if (command === "init") {
    const targetPath = readPathArg(args, ".");
    const report = await initRepository(targetPath, {
      dryRun: args.includes("--dry-run"),
      force: args.includes("--force")
    });

    console.log(formatInitReport(report));
    process.exit(0);
  }

  if (command === "badges") {
    const targetPath = readPathArg(args, ".");
    const report = await suggestBadges(targetPath);

    if (args.includes("--json")) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatBadgeReport(report));
    }

    process.exit(0);
  }

  console.error(`Unknown command: ${command}\n`);
  console.error(HELP);
  process.exit(2);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

function readPathArg(argv, fallback) {
  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--fail-under") {
      index += 1;
      continue;
    }

    if (!arg.startsWith("-")) {
      return arg;
    }
  }

  return fallback;
}

function readNumberOption(argv, name, fallback) {
  const index = argv.indexOf(name);
  if (index === -1) return fallback;

  const value = Number(argv[index + 1]);
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new Error(`${name} must be an integer from 0 to 100.`);
  }

  return value;
}
