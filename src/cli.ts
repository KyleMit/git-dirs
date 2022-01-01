import { Command, program } from 'commander';
import { commands } from './commands';

export const createProgram = (): Command => {

    commands.forEach((cmd) => program.addCommand(cmd) )

    return program
}

