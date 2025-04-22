import { execSync } from "child_process";
import fs from "fs";

export const createNextApp = async (name, termux) => {
  try {
    // create next app
    execSync(`npx create-next-app@latest ${name} --skip-install`, { stdio: "inherit" });

    // change directory
    process.chdir(name);

    // check termux environment
    if (termux) {
      // install only compatible dependencies
      execSync(
        `npm install --ignore-scripts`,
        { stdio: "inherit" }
      );

      // check if tailwindcss is installed
      const isTailwindInstalled = (() => {
        try {
          execSync(`npm list tailwindcss`, { stdio: "ignore" });
          return true;
        } catch {
          return false;
        }
      })();

      if (isTailwindInstalled) {
        execSync(`npm uninstall tailwindcss`, { stdio: "inherit" });
      }

      // install a compatible version of tailwindcss
      execSync(
        `npm install tailwindcss@3.4.17 postcss autoprefixer`,
        { stdio: "inherit" }
      );

      // initialize configuration file
      execSync(`npx tailwindcss init -p`, { stdio: "inherit" });

      // write tailwindcss config file
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
      fs.writeFileSync('./tailwind.config.js', configTailwind, { encoding: "utf8" });

      // check if src/app directory exists
      const globalStylesPath = fs.existsSync('./src/app')
        ? './src/app/globals.css'
        : './src/globals.css';

      // write global styles
      const utilitiesTailwind = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
      fs.writeFileSync(globalStylesPath, utilitiesTailwind, { encoding: "utf8" });

      // install prettier for tailwindcss
      execSync(`npm install -D prettier prettier-plugin-tailwindcss`, { stdio: "inherit" });

      // write prettier config
      const prettierTailwind = `{
  "plugins": ["prettier-plugin-tailwindcss"]
}`;
      fs.writeFileSync('./.prettierrc', prettierTailwind, { encoding: "utf8" });
    }

    // delete the .git directory
    if (fs.existsSync('./.git')) {
      fs.rmSync('./.git', { recursive: true, force: true });
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};
