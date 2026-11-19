const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const portable = path.resolve(root, "../.tools/node-v24.15.0-win-x64/node.exe");
const cli = path.join(root, "node_modules/@angular/cli/bin/ng.js");
if (!fs.existsSync(cli)) {
  console.error(
    "Faltan dependencias. Ejecutá npm install en museos-de-cordoba.",
  );
  process.exit(1);
}
const child = spawnSync(
  fs.existsSync(portable) ? portable : process.execPath,
  [cli, ...process.argv.slice(2)],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NG_CLI_ANALYTICS: "false" },
  },
);
if (child.error) console.error(child.error.message);
process.exit(child.status ?? 1);

