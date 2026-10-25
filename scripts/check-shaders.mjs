import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

// Use the locked local CLI; never fetch a different compiler during validation.
const cli = resolve("node_modules/.bin/vgpu");
const requested = process.argv.slice(2).filter((arg) => arg !== "--");
const files = requested.length ? requested : readdirSync("registry/shader")
  .filter((file) => file.endsWith(".wgsl"))
  .map((file) => `registry/shader/${file}`);

if (!files.length) throw new Error("No shaders found to validate");
for (const file of files) {
  const result = spawnSync(cli, ["check", file, "--require-validation"], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    console.error(result.error ?? `${result.stdout}\n${result.stderr}`);
    process.exit(1);
  }
  console.log(`Validated ${file}`);
}
