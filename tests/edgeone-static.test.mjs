import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("EdgeOne trial output is a self-contained public travel page", async () => {
  const html = await readFile("out/index.html", "utf8");
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /行知旅行/);
  assert.match(html, /function generate\(\)/);
  assert.match(html, /高德地图搜索/);
  assert.doesNotMatch(html, /AI_API_KEY|\.env\.local/);
});
