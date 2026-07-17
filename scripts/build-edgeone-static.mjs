import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    EDGEONE_STATIC: "1",
    NEXT_PUBLIC_STATIC_PLANNER: "1",
  },
});

process.exit(result.status ?? 1);
