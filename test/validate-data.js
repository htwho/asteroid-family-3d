import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const payload = JSON.parse(await readFile(new URL("../asteroid_families.json", import.meta.url), "utf8"));
assert.ok(payload.metadata, "metadata is required");
assert.ok(Array.isArray(payload.columns), "columns must be an array");
assert.ok(Array.isArray(payload.families) && payload.families.length > 0, "families must be a non-empty array");

const numericFields = ["family_id", "a_center_au", "e_center", "i_center_deg", "n_members"];
let usableCount = 0;
for (const [index, family] of payload.families.entries()) {
  for (const field of numericFields) assert.ok(Number.isFinite(family[field]), `families[${index}].${field} must be finite`);
  const usable = family.a_center_au > 0 && family.e_center >= 0 && family.e_center < 1;
  const sentinel = family.a_center_au < 0 && family.e_center < 0 && family.n_members === 0;
  assert.ok(usable || sentinel, `families[${index}] must contain usable elements or documented negative sentinel values`);
  if (usable) usableCount += 1;
}

assert.ok(usableCount > 0, "at least one family must contain usable orbital elements");
console.log(`Validated ${payload.families.length} records (${usableCount} usable families).`);
