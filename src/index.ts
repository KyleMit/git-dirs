#!/usr/bin/env node

import { createProgram } from "./cli"
import { version } from "../package.json";


main()

async function main() {

    const program = createProgram()

    await program
        .name("faq-cli")
        .version(version)
        .parseAsync(process.argv);

}
