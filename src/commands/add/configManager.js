import fs from "fs/promises";
import path from "path";

// absolute path of configuration file
export const configPath = path.resolve("dev.x.config.json");

export const findComponentInJson = async (componentName, output) => {
  const jsonData = await fs.readFile(configPath, "utf-8");
  const data = JSON.parse(jsonData);

  // search component by name and path
  const existingComponent = data.components.find(
    (component) =>
      component.name === componentName && component.output === output,
  );

  return existingComponent || null;
};

// create the configuration file
export const createConfigFile = async () => {
  try {
    // configuration file already exists
    await fs.access(configPath);
  } catch {
    // configuration file created
    const initialData = { components: [] };
    await fs.writeFile(
      configPath,
      JSON.stringify(initialData, null, 2),
      "utf-8",
    );
  }
};

export const saveComponentInfo = async (name, output) => {
  try {
    // read the configuration file
    const jsonData = await fs.readFile(configPath, "utf-8");
    const configData = JSON.parse(jsonData);

    // check component with the same name and path
    const existingIndex = configData.components.findIndex(
      (component) => component.name === name && component.output === output,
    );

    if (existingIndex !== -1) {
      // overwrites component information
      configData.components[existingIndex] = { name, output };
    } else {
      // add the component to the config file
      configData.components.push({ name, output });
    }

    // write changes to configuration file
    await fs.writeFile(
      configPath,
      JSON.stringify(configData, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Error saving component:", error.message);

    // try creating the file again
    if (error.code === "ENOENT" || error.message.includes("Unexpected")) {
      await createConfigFile();
      console.log("File repaired, try adding the component again");
    }
  }
};

// get installed components
export const getInstalledComponents = async (configPath) => {
  try {
    // check if file exists
    await fs.access(configPath);

    // read the configuration file
    const configData = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configData);

    // return component names
    return config.components.map((component) => component.name);
  } catch (error) {
    return [];
  }
};
