import { program } from "commander";
import { config } from "dotenv";
import { initNewCommand } from "./commands";
import { initGenerateCommand } from "./commands/generate";

config();
initNewCommand();
initGenerateCommand();

program.parse(process.argv);
