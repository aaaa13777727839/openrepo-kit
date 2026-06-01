import { promises as fs } from "node:fs";
import path from "node:path";
import { buildTemplates } from "./templates.js";

export async function initRepository(targetPath = ".", options = {}) {
  const root = path.resolve(targetPath);
  const templates = await buildTemplates(root);
  const written = [];
  const skipped = [];
  const planned = [];

  await fs.mkdir(root, { recursive: true });

  for (const template of templates) {
    const absolutePath = path.join(root, template.path);
    const exists = await fileExists(absolutePath);

    if (exists && !options.force) {
      skipped.push(template.path);
      continue;
    }

    if (options.dryRun) {
      planned.push(template.path);
      continue;
    }

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, template.content, "utf8");
    written.push(template.path);
  }

  return {
    path: root,
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
    written,
    skipped,
    planned
  };
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}
