import fs from "node:fs/promises";
import path from "node:path";

export function createContentSource(root) {
  async function readJson(file) {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  }

  return { readJson, status: { mode: "local-json" } };
}
