import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

test("verify script passes when rg is unavailable and grep fallback is needed", () => {
  const output = execFileSync("sh", ["scripts/verify-pmp-learning.sh"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PATH: "/usr/bin:/bin:/usr/sbin:/sbin"
    },
    encoding: "utf8"
  });

  assert.match(output, /OK: verification passed/);
});
