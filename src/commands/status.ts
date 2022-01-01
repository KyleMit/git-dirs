import chalk from "chalk";
import { Command } from "commander"
import { stat } from "fs";
import { cmd, filterAsync, getCurrentWorkingDirectory, getDirectories, getGitDirectories, getGitStatusInfo, getParentDirectory, isGitDirectory, mapAsync } from "../utils"

export const statusCmd = new Command('status')
    .description('show the working tree status')
    .action(async (_) => {
        // todo, either use current or pass in from option
        const cwd = getCurrentWorkingDirectory()
        const dir = getParentDirectory(cwd);

        const gitDirs = await getGitDirectories(dir);
        const gitStatuses = await mapAsync(gitDirs, getGitStatusInfo)

        const statusSorted = gitStatuses.sort((a,b) => Number(b.isDirty) - Number(a.isDirty))

        statusSorted.forEach(repo => {
            if (repo.isDirty) {
                console.log(chalk.bold.blue(repo.name))
                console.log(repo.status)
                console.log()
            } else {
                console.log(chalk.bold.green(repo.name))
            }

        })
    })
