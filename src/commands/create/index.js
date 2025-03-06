//import fs from "fs";
//import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import { execSync } from "child_process";
import __dirname from "../../utils/pathUtils.js";
import { frameworkList } from "../../data/frameworkList.js";

export const command = "create [framework]";
export const describe = "Create a new project";

export const builder = {
  framework: {
    describe: "The framework to use for the project",
    type: "string",
    //    demandOption: true,
  },
  name: {
    describe: "The project name",
    type: "string",
    alias: "n",
    default: "my-app",
  },
  list: {
    describe: "Show available frameworks",
    type: "boolean",
    alias: "l",
    default: false,
  },
};

export const handler = (argv) => {
  const { framework, name, list } = argv;

  if (list) {
    const table = new Table({
      head: [chalk.red.bold("Framework"), chalk.red.bold("Description")],
      colWidths: [20, 30],
    });

    frameworkList.forEach((item) => {
      table.push([chalk.cyan(item.name), chalk.gray(item.description)]);
    });

    console.log(chalk.green.underline("\nAvailable frameworks:\n"));
    console.log(table.toString());
    process.exit(0);
  }

  if (!framework) {
    console.log(chalk.red("Error: You must specify a framework to create a project."));
    console.log(chalk.yellow("Use the '--list' or '-l' flag to see available frameworks."));
    process.exit(1);
  }

  const isValidFramework = frameworkList.some((item) => item.name === framework);

  if (!isValidFramework) {
    console.log(chalk.red(`Error: '${framework}' is not a supported framework.`));
    console.log(chalk.yellow("Use the '--list' or '-l' flag to see available frameworks."));
    process.exit(1);
  }

  try {
    console.log(chalk.blue(`Initializing ${framework} project '${name}'...`));
    switch (framework) {
      case "next":
        execSync(`npx create-next-app@latest ${name}`, { stdio: "inherit" });
        break;
      case "react":
        execSync(`npx create-vite@latest ${name}`, { stdio: "inherit" });
        break;
      case "nest":
        execSync(`npx @nestjs/cli new ${name}`, { stdio: "inherit" });
        break;
      case "express":
        execSync(`npx express-generator ${name}`, { stdio: "inherit" });
        break;
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
    console.log(chalk.green(`${framework} project '${name}' created successfully.`));
  } catch (error) {
    console.log(chalk.red("An error occurred during project initialization."));
    console.error(error.message);
    process.exit(1);
  }
};
