import { Command, program } from 'commander';
import { listCmd, commands } from './commands';

export const createProgram = (): Command => {

    program.addCommand(listCmd, { isDefault: true})
    commands.forEach((cmd) => program.addCommand(cmd) )

    return program
}

