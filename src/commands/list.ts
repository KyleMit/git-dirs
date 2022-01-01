import { Command } from "commander"
import inquirer from "inquirer";
import { createProgram } from "../cli";
import { commands } from './'

export const listCmd = new Command('list')
    .description('select from available commands')
    .action(async (cmd) => {

        const choices = [
            ...commands.map(cmd => cmd.name),
            "help",
            "version"
        ]

        const questions = [{
            type: 'list',
            name: 'cmd',
            message: 'Choose a command to run',
            loop: false,
            pageSize: Math.min(choices.length, 10),
            choices: choices
        }];

        const answers = await inquirer.prompt(questions)

        // todo - fix
        const program = createProgram()
        await program.parseAsync([...process.argv, answers.cmd]);
    })
