import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";

export const createExpressApp = async (name) => {
  try {
    // config inquirer answers
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "In what language do you want to create the project?",
        choices: ["TypeScript", "JavaScript"],
      },
    ]);

    if (answers.language === "JavaScript") {
      // create express app
      fs.mkdirSync(name, { recursive: true });

      // change directory
      process.chdir(name);

      // create package.json
      const packageJsonContent = `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env src/index.js",
    "start": "node src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}`;
      fs.writeFileSync("./package.json", packageJsonContent, {
        encoding: "utf8",
      });

      // install aditional modules
      execSync(
        `npm install express morgan cors axios bcryptjs jsonwebtoken mongoose`,
        { stdio: "inherit" },
      );

      // create .env file
      const envFile = `PORT=4000`;
      fs.writeFileSync("./.env", envFile, { encoding: "utf8" });

      // create src and config directory
      fs.mkdirSync("src/config", { recursive: true });

      // create app script
      const appContent = `import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

export default app;`;
      fs.writeFileSync("./src/app.js", appContent, { encoding: "utf8" });

      // create config script
      const configContent = `export const PORT = process.env.PORT || 4000;`;
      fs.writeFileSync("./src/config/config.js", configContent, {
        encoding: "utf8",
      });

      // create main script
      const indexContent = `import app from "./app.js";
import { PORT } from "./config/config.js";

function main() {
  try {
    app.listen(PORT, () => {
      console.log('http://localhost:' + PORT);
    });
  } catch (error) {
    console.error(error);
  }
}

main();`;

      fs.writeFileSync("./src/index.js", indexContent, { encoding: "utf8" });
    } else {
      // create express/typescript app
      fs.mkdirSync(name, { recursive: true });

      // change directory
      process.chdir(name);

      // create package.json
      const packageJsonContent = `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node-dev --env-file=.env --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}`;
      fs.writeFileSync("./package.json", packageJsonContent, {
        encoding: "utf8",
      });

      // install aditional modules
      execSync(
        `npm install express morgan cors axios bcryptjs jsonwebtoken typeorm reflect-metadata pg`,
        { stdio: "inherit" },
      );

      // install devDependencies
      execSync(
        `npm install typescript ts-node-dev @types/node @types/express @types/morgan @types/cors @types/bcryptjs @types/jsonwebtoken -D`,
        { stdio: "inherit" },
      );

      // create directory
      fs.mkdirSync("src/config", { recursive: true });
      fs.mkdirSync("src/entities", { recursive: true });

      // create tsconfig file
      const tsconfigContent = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;

      fs.writeFileSync("./tsconfig.json", tsconfigContent, {
        encoding: "utf8",
      });

      // create orm config file
      const ormConfigContent = `import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "your_database",
  synchronize: true, // dev only
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});

export default AppDataSource;`;

      fs.writeFileSync("./src/ormconfig.ts", ormConfigContent, {
        encoding: "utf8",
      });

      // create .env file
      const envFile = `PORT=4000`;
      fs.writeFileSync("./.env", envFile, { encoding: "utf8" });

      // create config script
      const configContent = `export const PORT = process.env.PORT || 4000;`;
      fs.writeFileSync("./src/config/config.ts", configContent, {
        encoding: "utf8",
      });

      // create User entitie
      const userEntitieContent = `import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}`;
      fs.writeFileSync("./src/entities/User.ts", userEntitieContent, {
        encoding: "utf8",
      });

      // create app script
      const appContent = `import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

export default app;`;
      fs.writeFileSync("./src/app.ts", appContent, { encoding: "utf8" });

      // create main script
      const indexContent = `import app from "./app";
import { PORT } from "./config/config";

function main() {
  try {
    app.listen(PORT, () => {
      console.log('http://localhost:' + PORT);
    });
  } catch (error) {
    console.error(error);
  }
}

main();`;

      fs.writeFileSync("./src/index.ts", indexContent, { encoding: "utf8" });
    }
  } catch (error) {
    console.error(error);
  }
};
