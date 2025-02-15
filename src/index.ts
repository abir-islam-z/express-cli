import { program } from "commander";
import { config } from "dotenv";
import { initNewCommand } from "./commands";
import { initGenerateCommand } from "./commands/generate";

config();
initGenerateCommand();
initNewCommand();

program.parse(process.argv);
