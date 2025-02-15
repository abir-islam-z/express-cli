import { program } from "commander";
import { generateByType } from "../generators/generateByType";
import { generateModule } from "../generators/generateModule";

export const initGenerateCommand = () => {
  const generateCommand = program.command("generate").alias("g");
  generateCommand.arguments("<type> <name>").action(async (type, name) => {
    if (type === "module" || type === "mo") {
      generateModule(name);
      return;
    }
    await generateByType(type, name);
  });
};
