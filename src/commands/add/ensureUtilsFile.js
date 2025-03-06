import fs from "fs";
import path from "path";
import chalk from "chalk";

export const ensureUtilsFile = (usesTypeScript) => {
  // lib directory path
  const projectRoot = process.cwd();
  const libDir = path.join(projectRoot, "src", "lib");
  const utilsFileName = usesTypeScript ? "utils.ts" : "utils.js";
  const utilsFilePath = path.join(libDir, utilsFileName);

  // check if opposite file exists
  const oppositeFileName = usesTypeScript ? "utils.js" : "utils.ts";
  const oppositeFilePath = path.join(libDir, oppositeFileName);

  // if opposite file exists
  if (fs.existsSync(oppositeFilePath)) {
    return;
  }

  // check if the file already exists
  if (fs.existsSync(utilsFilePath)) {
    return;
  }

  // create directory if it does not exist
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // define file content (.ts or .js)
  const utilsContent = usesTypeScript
    ? `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
    : `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

  // create utils file with the content
  fs.writeFileSync(utilsFilePath, utilsContent, "utf8");
  console.log(`${chalk.cyan(utilsFileName)} ${chalk.gray('added to ->')} ${chalk.green('./src/lib')}`);
};
