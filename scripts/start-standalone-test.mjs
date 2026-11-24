import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const standaloneRoot = resolve(root, ".next/standalone");

if (!existsSync(resolve(standaloneRoot, "server.js"))) {
  throw new Error("Standalone build not found. Run `npm run build` before the browser test.");
}

mkdirSync(resolve(standaloneRoot, ".next"), { recursive: true });
cpSync(resolve(root, ".next/static"), resolve(standaloneRoot, ".next/static"), {
  recursive: true,
});
if (existsSync(resolve(root, "public"))) {
  cpSync(resolve(root, "public"), resolve(standaloneRoot, "public"), {
    recursive: true,
  });
}

process.env.HOSTNAME = "127.0.0.1";
process.env.PORT = process.env.PORT ?? "3100";

await import("../.next/standalone/server.js");
