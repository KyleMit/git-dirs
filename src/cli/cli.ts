import { Command, program } from 'commander';
import { commands } from '.';
import { printDim, gitDirsDisplay } from "../utils";

export const createProgram = (): Command => {

    commands.forEach((cmd) => program.addCommand(cmd) )
    program.addHelpText('before', printDim(gitDirsDisplay))

    return program
}

