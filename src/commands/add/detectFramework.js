import fs from "fs";
import path from "path";

export const detectFramework = () => {
  const projectRoot = process.cwd();

  // check for Next.js configuration
  if (fs.existsSync(path.join(projectRoot, "next.config.ts"))) {
    return { framework: "next", usesTypeScript: true };
  }
  if (fs.existsSync(path.join(projectRoot, "next.config.mjs"))) {
    return { framework: "next", usesTypeScript: false };
  }

  // check for React + Vite configuration
  if (fs.existsSync(path.join(projectRoot, "vite.config.ts"))) {
    return { framework: "react", usesTypeScript: true };
  }
  if (fs.existsSync(path.join(projectRoot, "vite.config.js"))) {
    return { framework: "react", usesTypeScript: false };
  }

  // framework not detected
  console.error(
    "Error: No valid framework detected (Next.js or React + Vite).",
  );
  return null;
};
