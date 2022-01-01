import chalk from "chalk";
import { Command, Option } from "commander"
import { getCurrentWorkingDirectory, getGitDirectories, getGitStatusInfo, IGitStatusInfo, mapAsync } from "../utils"

enum StatusSortTypes {
    status = "status",
    alpha = "alpha"
}
interface IStatusOptions {
    dir?: string;
    showAll?: boolean;
    sort: StatusSortTypes
}

export const statusCmd = new Command('status')
    .description('show the working tree status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-a, --show-all', 'show all repo statuses')
    .addOption(new Option('-s, --sort <order>', 'sort order').choices(Object.values(StatusSortTypes)).default(StatusSortTypes.status))
    .action(async (opts: IStatusOptions) => {

        const dir = opts.dir || getCurrentWorkingDirectory()
        const gitDirs = await getGitDirectories(dir);
        const gitStatuses = await mapAsync(gitDirs, getGitStatusInfo)

        const sortFunc = opts.sort === StatusSortTypes.alpha
            ? (a: IGitStatusInfo, b:IGitStatusInfo) => a.name.localeCompare(b.name)
            : (a: IGitStatusInfo, b:IGitStatusInfo) => Number(b.isDirty) - Number(a.isDirty)

        const statusSorted = gitStatuses.sort(sortFunc)

        statusSorted.forEach(repo => {
            if (repo.isDirty) {
                console.log(chalk.bold.blue(repo.name))
                console.log(repo.status)
                console.log()
            }
            if (opts.showAll) {
                console.log(chalk.bold.green(repo.name))
            }
        })

    })
