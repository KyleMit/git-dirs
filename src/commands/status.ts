import { Command, Option } from "commander"
import { IStatusOptions, StatusFilterTypes, StatusOrderTypes } from "../models";
import { boolCompare, getCurrentWorkingDirectory, getGitDirectories, getGitStatusInfo, mapAsync, printBlue, printBold, printCyan, printGreen, printRed } from "../utils"

const statusAction = async (opts: IStatusOptions) => {
    const dir = opts.dir || getCurrentWorkingDirectory()
    const gitDirs = await getGitDirectories(dir);
    const gitStatuses = await mapAsync(gitDirs, getGitStatusInfo)


    const filtered = opts.filter == StatusFilterTypes.all
        ? gitStatuses
        : gitStatuses.filter(r => r.isDirty)

    const sorted = opts.order == StatusOrderTypes.alpha
        ? filtered.sort((a, b) => a.name.localeCompare(b.name))
        : filtered.sort((a, b) => boolCompare(b.tooManyChanges, a.tooManyChanges) || boolCompare(b.isDirty, a.isDirty))

    sorted.forEach(repo => {
        const branch = printCyan(` (${repo.branch})`)
        if (repo.isDirty) {
            console.log(printBold(printBlue(repo.name)) + branch)
            if (repo.tooManyChanges) {
                console.log(printRed(`Too many changes - run manually with:\n$ git -C '${repo.path}' status`))
            } else {
                console.log(repo.status)
            }
        } else {
            console.log(printGreen(repo.name))
        }
    })

}

export const statusCmd = new Command('status')
    .description('show the working tree status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-s, --short', 'show statuses in a single line per repo')
    .addOption(new Option('-f, --filter <filter>', 'filter results').choices(Object.values(StatusFilterTypes)).default(StatusFilterTypes.all))
    .addOption(new Option('-o, --order <sort>', 'sort order').choices(Object.values(StatusOrderTypes)).default(StatusOrderTypes.status))
    .action(statusAction)
