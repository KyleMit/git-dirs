#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { createProgram } from "./cli"
// import { version } from "../package.json";
// TODO - Fix

main()

async function main() {

    // only display with help text
    console.log(
        chalk.grey(
            figlet.textSync('git-dir', { horizontalLayout: 'full' })
        )
    );
    console.log()

    const program = createProgram()

    await program
        .name("git-dir")
        // .version(version)
        .parseAsync(process.argv);

}
