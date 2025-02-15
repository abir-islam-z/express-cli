import { program } from "commander";
import { config } from "dotenv";
import { generateCommand } from "./generator/generateCommand";

config();
generateCommand();

program.parse(process.argv);
