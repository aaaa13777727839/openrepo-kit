#!/usr/bin/env node
import { auditRepository } from "../src/audit.js";
import { initRepository } from "../src/init.js";
import { formatAuditReport, formatInitReport } from "../src/report.js";

const HELP = `openrepo-kit

Audit and bootstrap GitHub-ready open-source repositories.

Usage:
  openrepo-kit audit [path] [--json]
  openrepo-kit init [path] [--force] [--dry-run]
  openrepo-kit help

Commands:
  audit   Score repository health and list practical fixes.
  init    Create missing README, license, community files, and CI.
  help    Show this help message.

Options:
  --json     Print machine-readable JSON for audit.
  --force    Overwrite files during init.
  --dry-run  Show files that would be written without changing disk.
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
    const report = await auditRepository(targetPath);

    if (args.includes("--json")) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatAuditReport(report));
    }

    process.exit(report.score >= 70 ? 0 : 1);
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

  console.error(`Unknown command: ${command}\n`);
  console.error(HELP);
  process.exit(2);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

function readPathArg(argv, fallback) {
  const maybePath = argv.slice(1).find((arg) => !arg.startsWith("-"));
  return maybePath ?? fallback;
}
