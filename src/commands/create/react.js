import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const createReactApp = async (name, termux) => {
  try {
    // create a new react project
    execSync(`npx create-vite@latest ${name}`, { stdio: "inherit" });

    // change directory
    process.chdir(name);

    // install dependencies
    execSync(`npm install`, { stdio: "inherit" });

    // install additional modules
    execSync(`npm install react-router-dom`, { stdio: "inherit" });

    // check Termux environment
    if (termux) {
      // install a compatible version of TailwindCSS
      execSync(`npm install tailwindcss@3.4.17 postcss autoprefixer`, {
        stdio: "inherit",
      });

      // initialize configuration file
      execSync(`npx tailwindcss init -p`, { stdio: "inherit" });

      // write TailwindCSS configuration
      const configTailwind = `/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      fs.writeFileSync("./tailwind.config.js", configTailwind, {
        encoding: "utf8",
      });

      // configure global styles for TailwindCSS
      const utilitiesTailwind = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
      fs.writeFileSync("./src/index.css", utilitiesTailwind, {
        encoding: "utf8",
      });

      // install Prettier and TailwindCSS plugin
      execSync(`npm install -D prettier prettier-plugin-tailwindcss`, {
        stdio: "inherit",
      });

      // write prettier configuration
      const prettierTailwind = `{
  "plugins": ["prettier-plugin-tailwindcss"]
}`;
      fs.writeFileSync("./.prettierrc", prettierTailwind, { encoding: "utf8" });
    } else {
      // install TailwindCSS for other environments
      execSync(`npm install tailwindcss @tailwindcss/vite`, {
        stdio: "inherit",
      });

      // check for vite.config.js or vite.config.ts
      const viteConfigPathJS = path.join(process.cwd(), "vite.config.js");
      const viteConfigPathTS = path.join(process.cwd(), "vite.config.ts");

      const viteConfigContent = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})`;

      if (fs.existsSync(viteConfigPathTS)) {
        fs.writeFileSync(viteConfigPathTS, viteConfigContent, { encoding: "utf8" });
      } else if (fs.existsSync(viteConfigPathJS)) {
        fs.writeFileSync(viteConfigPathJS, viteConfigContent, { encoding: "utf8" });
      } else {
        // if neither exists, create a vite.config.js file
        fs.writeFileSync("vite.config.js", viteConfigContent, { encoding: "utf8" });
      }

      // add TailwindCSS utilities
      const utilitiesTailwind = `@import "tailwindcss";`;
      fs.writeFileSync("./src/index.css", utilitiesTailwind, {
        encoding: "utf8",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};
