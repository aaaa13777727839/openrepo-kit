export function formatAuditReport(report) {
  const lines = [
    `OpenRepo Kit audit: ${report.path}`,
    `Score: ${report.score}/100 (${report.grade})`,
    "",
    "Checks:"
  ];

  for (const check of report.checks) {
    const marker = check.passed ? "PASS" : "TODO";
    lines.push(`  ${marker} ${check.title} (${check.weight} pts)`);

    if (!check.passed) {
      lines.push(`       ${check.fix}`);
    }
  }

  if (report.failed === 0) {
    lines.push("", "Nice. This repository has the expected open-source basics.");
  } else {
    lines.push(
      "",
      `Next step: run "openrepo-kit init ${quotePath(report.path)}" to create missing starter files.`
    );
  }

  return lines.join("\n");
}

export function formatMarkdownAuditReport(report) {
  const lines = [
    "# OpenRepo Kit Audit",
    "",
    `**Repository:** \`${report.path}\``,
    `**Score:** ${report.score}/100 (${report.grade})`,
    "",
    "| Status | Check | Weight | Fix |",
    "| --- | --- | ---: | --- |"
  ];

  for (const check of report.checks) {
    const status = check.passed ? "PASS" : "TODO";
    const fix = check.passed ? "" : check.fix;
    lines.push(
      `| ${status} | ${escapeMarkdownTable(check.title)} | ${check.weight} | ${escapeMarkdownTable(fix)} |`
    );
  }

  if (report.failed === 0) {
    lines.push("", "This repository has the expected open-source basics.");
  } else {
    lines.push(
      "",
      `Run \`openrepo-kit init ${quotePath(report.path)}\` to create missing starter files.`
    );
  }

  return lines.join("\n");
}

export function formatInitReport(report) {
  const action = report.dryRun ? "would write" : "wrote";
  const lines = [`OpenRepo Kit init: ${report.path}`];
  const changed = report.dryRun ? report.planned : report.written;

  if (changed.length > 0) {
    lines.push("", `Files ${action}:`);
    for (const file of changed) {
      lines.push(`  - ${file}`);
    }
  } else {
    lines.push("", "No files needed to be written.");
  }

  if (report.skipped.length > 0) {
    lines.push("", "Skipped existing files:");
    for (const file of report.skipped) {
      lines.push(`  - ${file}`);
    }
    lines.push("", "Use --force to overwrite existing files.");
  }

  return lines.join("\n");
}

export function formatBadgeReport(report) {
  const lines = [`OpenRepo Kit badges: ${report.path}`];

  if (report.repository) {
    lines.push(
      `Repository: ${report.repository.owner}/${report.repository.name}`,
      ""
    );
  } else {
    lines.push("Repository: not detected", "");
  }

  if (report.badges.length === 0) {
    lines.push("No badge suggestions found.");
    return lines.join("\n");
  }

  lines.push("Suggested README badges:", "");
  for (const badge of report.badges) {
    lines.push(`- ${badge.title}: ${badge.reason}`, badge.markdown, "");
  }

  lines.push("Copy the badge lines near the top of your README.");
  return lines.join("\n");
}

function quotePath(value) {
  return /\s/.test(value) ? JSON.stringify(value) : value;
}

function escapeMarkdownTable(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}
