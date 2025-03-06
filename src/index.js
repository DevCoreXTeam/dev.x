#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync } from "fs";
import path from "path";
import __dirname from "./utils/pathUtils.js";

// commands
import * as addCommand from "./commands/add/index.js";
import * as createCommand from "./commands/create/index.js";

// show version
const packageJsonPath = path.join(__dirname, "../../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

// yargs config
yargs(hideBin(process.argv))
  .scriptName("dev")
  .command(addCommand)
  .command(createCommand)
  .demandCommand(1, "Specify at least one command")
  .strict()
  .version(packageJson.version)
  .alias("help", "h")
  .alias("version", "v")
  .help().argv;
