import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    EDGEONE_STATIC: "1",
    NEXT_PUBLIC_STATIC_PLANNER: "1",
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const outDir = join(process.cwd(), "out");
const nextAssets = join(outDir, "_next");
const edgeAssets = join(outDir, "assets-next");

if (existsSync(nextAssets)) {
  cpSync(nextAssets, edgeAssets, { recursive: true });
}

function rewriteAssetPaths(dir) {
  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      rewriteAssetPaths(filePath);
      continue;
    }
    if (!/\.(html|js|txt)$/.test(name)) continue;
    const original = readFileSync(filePath, "utf8");
    const rewritten = original
      .replaceAll("./_next/", "./assets-next/")
      .replaceAll("/_next/", "/assets-next/");
    if (rewritten !== original) {
      writeFileSync(filePath, rewritten);
    }
  }
}

rewriteAssetPaths(outDir);

const cssDir = join(edgeAssets, "static", "chunks");
const htmlFiles = ["index.html", "404.html"].map((name) => join(outDir, name));

if (existsSync(cssDir)) {
  const css = readdirSync(cssDir)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(join(cssDir, name), "utf8"))
    .join("\n")
    .replaceAll("</style", "<\\/style");

  for (const htmlFile of htmlFiles) {
    if (!existsSync(htmlFile)) continue;
    const original = readFileSync(htmlFile, "utf8");
    if (original.includes("edgeone-inline-css")) continue;
    const inlineStyle = `<style id="edgeone-inline-css">${css}</style>`;
    writeFileSync(htmlFile, original.replace("</head>", `${inlineStyle}</head>`));
  }
}
