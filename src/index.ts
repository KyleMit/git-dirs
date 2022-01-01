#!/usr/bin/env node

import { createProgram } from "./cli"
import { version } from "../package.json";


main()

async function main() {

    const program = createProgram()

    await program
        .name("git-for-each")
        .alias("git-fe")
        .version(version)
        .parseAsync(process.argv);

}
