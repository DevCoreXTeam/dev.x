import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import Table from "cli-table3";
import { execSync } from "child_process";
import __dirname from "../../utils/pathUtils.js";
import { componentList } from "../../data/componentList.js";
import { detectFramework } from "./detectFramework.js";
import {
  createConfigFile,
  findComponentInJson,
  getInstalledComponents,
  saveComponentInfo,
} from "./configManager.js";
import { ensureUtilsFile } from "./ensureUtilsFile.js";

export const command = "add [component]";
export const describe = "Generate a new component";

export const builder = {
  component: {
    describe: "The type of component to generate",
    type: "string",
  },
  type: {
    describe: "The file type (.jsx or .tsx)",
    type: "string",
    alias: "t",
  },
  output: {
    describe: "The path where the component is generated",
    type: "string",
    alias: "o",
  },
  theme: {
    describe: "The theme of the component",
    type: "string",
    default: "default",
    alias: "th",
  },
  framework: {
    describe: "The framework being used (next or react)",
    type: "string",
    alias: "f",
  },
  list: {
    describe: "Show available components",
    type: "boolean",
    alias: "l",
    default: false,
  },
};

export const handler = async (argv) => {
  // get component name
  const { component } = argv;

  // initial argument variables
  let { type, output, theme, framework, list } = argv;

  // create table for available components
  if (list) {
    const table = new Table({
      head: [chalk.red.bold("Component"), chalk.red.bold("Dependencies")],
      colWidths: [20, 30],
    });

    // insert data into table
    componentList.forEach((comp) => {
      table.push([
        chalk.cyan(comp.name),
        comp.dependencies.join(", ") || chalk.gray("None"),
      ]);
    });

    // show table
    console.log(chalk.green.underline("\nAvailable components:\n"));
    console.log(table.toString());
    process.exit(0);
  }

  // auto-detect framework
  const frameworkData = framework
    ? { framework, usesTypeScript: framework === "next" }
    : detectFramework();

  // framework not detected
  if (!frameworkData) return;
  const { framework: detectedFramework, usesTypeScript } = frameworkData;

  // default arguments
  type = type || (usesTypeScript ? "tsx" : "jsx");
  output = output || "./src/components/generated";
  theme = theme || "default";
  framework = framework || detectedFramework;

  // validate component
  if (!component || typeof component !== "string") {
    console.error(
      chalk.red("Error: Component name must be a non-empty string."),
    );
    return;
  }

  // find component
  const foundComponent = componentList.find((comp) => comp.name === component);
  if (!foundComponent) {
    console.error(
      chalk.red("Error: Component not found in the component list."),
    );
    return;
  }

  // create utils file
  ensureUtilsFile(usesTypeScript);

  // get installed components
  const installedComponents = await getInstalledComponents();

  // check installed components
  const missingComponents = foundComponent.internalDependencies.filter(
    (dependency) => !installedComponents.includes(dependency),
  );

  // install missing components
  missingComponents.forEach((missingComponent) => {
    console.log(`Adding ${missingComponent} component...`);
    execSync(
      `dev add ${missingComponent} -t ${type} --th ${theme} -f ${framework} -o ${output}`,
      { stdio: "inherit" },
    );
  });

  try {
    // create config file in the root
    await createConfigFile();

    // find component in configuration file
    const existingComponent = await findComponentInJson(
      foundComponent.name,
      output,
    );

    if (existingComponent) {
      console.log(
        `The "${foundComponent.name}" component already exists in the path "${output}".`,
      );

      // ask if you want to overwrite
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: "Do you want to overwrite the existing component?",
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log("Abort");
        return;
      }
    }

    // save or overwrite component
    await saveComponentInfo(foundComponent.name, output);
  } catch (error) {
    console.error("Error:", error.message);
  }

  // get list of installed dependencies
  const result = execSync("npm list --json --depth=0", { encoding: "utf-8" });

  const parsedResult = JSON.parse(result);

  const installedDep = Object.keys(parsedResult.dependencies || {});

  const uniqueInstalledDep = [...new Set(installedDep)];

  // check missing dependencies
  const missingDeps = [
    ...new Set(
      foundComponent.dependencies.filter(
        (dep) => !uniqueInstalledDep.includes(dep),
      ),
    ),
  ];

  // validate and install dependencies
  if (missingDeps && missingDeps.length > 0) {
    missingDeps.forEach((dependency) => {
      console.log("Installing", dependency + "...");
      try {
        execSync(`npm install ${dependency}`);
      } catch (error) {
        console.error(
          chalk.red(`Error installing dependency "${dependency}":`),
          error.message,
        );
      }
    });
  }

  // resource directory
  const resourceDir = path.join(
    __dirname,
    "..",
    "resources",
    "frontend",
    "components",
    framework,
    component,
    theme,
  );

  // validate resource directory
  if (!fs.existsSync(resourceDir)) {
    console.error(chalk.red("Error: Resource directory does not exist."));
    return;
  }

  // create output directory
  if (!fs.existsSync(output)) {
    try {
      fs.mkdirSync(output, { recursive: true });
    } catch (error) {
      console.error(
        chalk.red("Error creating output directory:"),
        error.message,
      );
      return;
    }
  }

  // set file name and path
  const fileName = `${component}.${type}`;
  const sourceFile = path.join(resourceDir, fileName);
  const destinationFile = path.join(output, fileName);

  // validate source file
  if (!fs.existsSync(sourceFile)) {
    console.error(
      chalk.red(`Error: Source file "${sourceFile}" does not exist.`),
    );
    return;
  }

  // copy the file
  try {
    fs.copyFileSync(sourceFile, destinationFile);
  } catch (error) {
    console.error(chalk.red("Error copying file:"), error.message);
    return;
  }

  // successfully message
  console.log(
    chalk.cyan(`${component}.${type}`),
    chalk.gray("added to ->"),
    chalk.green(`${output}`),
  );
};
