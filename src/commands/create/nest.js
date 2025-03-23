import { execSync } from "child_process";

export const createNestApp = async (name) => {
  execSync(`npx @nestjs/cli new ${name}`, { stdio: "inherit" });
}
