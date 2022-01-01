#!/usr/bin/env node

import { createProgram } from "./cli"
import { version } from "../package.json";
import { gitDirsText } from "./config";
import { colors, printDim } from "./utils";

main()

async function main() {

    // TODO only display with help text
    console.log(printDim(gitDirsText))
    console.log();

    const program = createProgram()

    await program
        .name("git-dir")
        .version(version)
        .parseAsync(process.argv);

}
