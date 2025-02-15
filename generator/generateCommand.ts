import { program } from "commander";
import { generateFile } from "./generateFile";
import { generateModule } from "./generateModule";

export const generateCommand = () => {
  const generateCommand = program.command("generate").alias("g");
  generateCommand.arguments("<type> <name>").action(async (type, name) => {
    if (type === "module" || type === "mo") {
      generateModule(name);
      return;
    }
    await generateFile(type, name);
  });
};
