//import fs from "fs";
//import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import __dirname from "../../utils/pathUtils.js";
import { frameworkList } from "../../data/frameworkList.js";
import { createNextApp } from "./next.js";
import { createExpressApp } from "./express.js";
import { createNestApp } from "./nest.js";
import { createReactApp } from "./react.js";

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
  termux: {
    describe: "Create project for Termux enviroment",
    type: "boolean",
    alias: "T",
    default: false,
  }
};

export const handler = async (argv) => {
  const { framework, name, list, termux } = argv;

  // create table
  if (list) {
    const table = new Table({
      head: [chalk.red.bold("Framework"), chalk.red.bold("Description")],
      colWidths: [20, 30],
    });

    // show table
    frameworkList.forEach((item) => {
      table.push([chalk.cyan(item.name), chalk.gray(item.description)]);
    });

    console.log(chalk.green.underline("\nAvailable frameworks:\n"));
    console.log(table.toString());
    process.exit(0);
  }

  // error: need framework
  if (!framework) {
    console.log(chalk.red("Error: You must specify a framework to create a project."));
    console.log(chalk.yellow("Use the '--list' or '-l' flag to see available frameworks."));
    process.exit(1);
  }

  // framework is not supported
  const isValidFramework = frameworkList.some((item) => item.name === framework);

  if (!isValidFramework) {
    console.log(chalk.red(`Error: '${framework}' is not a supported framework.`));
    console.log(chalk.yellow("Use the '--list' or '-l' flag to see available frameworks."));
    process.exit(1);
  }

  // create framework app
  try {
    console.log(chalk.blue(`Initializing ${framework} project '${name}'...`));
    switch (framework) {
      case "next":
        await createNextApp(name, termux);
        break;
      case "react":
        await createReactApp(name, termux);
        break;
      case "nest":
        await createNestApp(name);
        break;
      case "express":
        await createExpressApp(name);
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
