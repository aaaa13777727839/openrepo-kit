import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";

test("action.yml exposes the composite action entrypoint", async () => {
  const action = await fs.readFile("action.yml", "utf8");

  assert.match(action, /using: composite/);
  assert.match(action, /fail-under:/);
  assert.match(action, /format:/);
  assert.match(action, /output:/);
  assert.match(action, /summary:/);
  assert.match(action, /bin\/openrepo-kit\.js/);
});
