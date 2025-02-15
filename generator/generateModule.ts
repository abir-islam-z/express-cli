import fs from "fs-extra";
import { INDEX_ROUTE_PATH } from "../const";

const updateIndexRouteFile = async (name: string) => {
  /**
   * ? Read the content of the index route file as string
   * */
  const indexRouteContent = await fs.readFile(INDEX_ROUTE_PATH, "utf8");

  /**
   * ? Split the content of the index route file into lines
   * */
  const lines = indexRouteContent.split("\n");

  /**
   * ? Create the import line
   * */
  const importLine = `import ${name}Routes from "../modules/${name.toLowerCase()}/${name.toLowerCase()}.route";`;

  /**
   * ? Check if the import line already exists in the index route file
   * */
  if (!lines.includes(importLine)) {
    /**
     * ? Add the import line to the second line of the index route file
     * */
    lines.splice(1, 0, importLine);
  }

  // Join the lines back into a single string
  const updatedContent = lines.join("\n");

  // Find the start and end indices of the moduleRoutes array
  const moduleRoutesStartIndex = updatedContent.indexOf(
    "const moduleRoutes = ["
  );
  const moduleRoutesEndIndex = updatedContent.indexOf(
    "];",
    moduleRoutesStartIndex
  );

  // Extract the moduleRoutes array content
  const moduleRoutesContent = updatedContent.substring(
    moduleRoutesStartIndex,
    moduleRoutesEndIndex + 2
  );

  // Process the moduleRoutes array content
  const moduleRoutes = moduleRoutesContent
    .replace("const moduleRoutes = [", "")
    .replace("];", "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Create the new route path and name
  const routePath = `"/${name.toLowerCase()}"`;
  const routeName = `${name}Routes`;

  // Add the new route to the moduleRoutes array if it doesn't already exist
  if (!moduleRoutes.includes(`{ path: ${routePath}, route: ${routeName}, }`)) {
    moduleRoutes.push(`{ path: ${routePath}, route: ${routeName}, }`);
  }

  // Create the updated moduleRoutes array content
  const updatedModuleRoutes = `const moduleRoutes = [\n${moduleRoutes.join(
    ",\n"
  )}\n];`;

  // Replace the old moduleRoutes array content with the updated content
  const updatedIndexRouteContent = updatedContent.replace(
    moduleRoutesContent,
    updatedModuleRoutes
  );

  // Write the updated index route content back to the file
  await fs.writeFile(INDEX_ROUTE_PATH, updatedIndexRouteContent);
};

export const generateModule = (name: string) => {
  console.log("generateModule", name);
};
