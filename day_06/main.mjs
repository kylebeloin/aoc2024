import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = fs.readFileSync(
  `${fileURLToPath(path.dirname(import.meta.url), "inputs.txt")}`,
  {
    encoding: "utf-8",
  }
);

const state = {
    direction: 
}
