#!/usr/bin/env node
/**
 * Publish script for the overflow-aware-list monorepo.
 *
 * Bun/npm do not always replace "workspace:*" references in package.json
 * before packing the tarball. This script temporarily rewrites those
 * references to the actual published version, runs `npm publish`, then
 * restores the originals — so the registry tarball always contains a
 * resolvable semver range instead of the workspace protocol.
 *
 * Publish order: core → react → svelte  (dependents after their deps)
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PACKAGES = [
  "packages/core",
  "packages/react",
  "packages/svelte",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

// Resolve every workspace:* reference to ^<version> using the actual
// published version of that package inside this monorepo.
function resolveWorkspaceDeps(json) {
  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    if (!json[field]) continue;
    for (const [name, range] of Object.entries(json[field])) {
      if (!range.startsWith("workspace:")) continue;

      // Find the local package that matches this name
      const match = PACKAGES.map((p) => {
        const pkgJson = readJson(resolve(root, p, "package.json"));
        return pkgJson.name === name ? pkgJson.version : null;
      }).find(Boolean);

      if (!match) {
        throw new Error(`Could not resolve workspace dep "${name}" — not found in PACKAGES list`);
      }

      json[field][name] = `^${match}`;
    }
  }
  return json;
}

for (const pkg of PACKAGES) {
  const pkgJsonPath = resolve(root, pkg, "package.json");
  const original = readFileSync(pkgJsonPath, "utf8");
  const json = readJson(pkgJsonPath);
  const patched = resolveWorkspaceDeps(structuredClone(json));

  const hasWorkspaceDeps =
    JSON.stringify(json) !== JSON.stringify(patched);

  if (hasWorkspaceDeps) {
    console.log(`\nPatching workspace:* refs in ${pkg}/package.json…`);
    writeJson(pkgJsonPath, patched);
  }

  try {
    console.log(`\nPublishing ${json.name}@${json.version}…`);
    const otp = process.argv.find((a) => a.startsWith("--otp="));
    const otpFlag = otp ? ` ${otp}` : "";
    execSync(`npm publish --access public${otpFlag}`, {
      cwd: resolve(root, pkg),
      stdio: "inherit",
    });
  } finally {
    if (hasWorkspaceDeps) {
      writeFileSync(pkgJsonPath, original);
      console.log(`Restored ${pkg}/package.json`);
    }
  }
}

console.log("\nAll packages published successfully.");
