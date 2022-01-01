import inquirer from 'inquirer';
import { Command, program } from 'commander';
import { cmd } from './utils';

export const createProgram = (): Command => {
    // list all commands
    program
        .command('interactive', { isDefault: true })
        .description('interactive inquirer CLI')
        .action(async (cmd) => {

            let questions = [{
                type: 'list',
                name: 'cmd',
                message: 'Choose a command to run',
                loop: false,
                pageSize: 5,
                choices: [
                    "help",
                    new inquirer.Separator(),
                    "status",
                ]
            }, ];

            let answers = await inquirer.prompt(questions)

            await program.parseAsync([...process.argv, answers.cmd]);
        })

    /* status */
    // https://git-scm.com/docs/git-status
    program
        .command('status')
        .description('show the working tree status')
        .action(async (_) => {
            const result = await cmd("git status")
            console.log(result)
        })


    return program
}

