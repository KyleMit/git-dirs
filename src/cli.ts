import { Command, program } from 'commander';
import { commands } from './commands';
import { gitDirsDisplay } from "./config";
import { printDim } from "./utils";

export const createProgram = (): Command => {

    commands.forEach((cmd) => program.addCommand(cmd) )
    program.addHelpText('before', printDim(gitDirsDisplay))

    return program
}

