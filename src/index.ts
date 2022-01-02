#!/usr/bin/env node

import { program } from 'commander';
import { commands } from './commands';
import { printDim, gitDirsDisplay } from "./utils";
import { version } from "../package.json";

export const main = async () => {

    commands.forEach((cmd) => program.addCommand(cmd) )
    program.addHelpText('before', printDim(gitDirsDisplay))

    await program
        .name("git-dirs")
        .version(version)
        .parseAsync(process.argv);

}

main()
