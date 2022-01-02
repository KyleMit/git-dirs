import { Command, Option } from "commander"
import { IStatusOptions, StatusFilterTypes, StatusOrderTypes } from "../models";
import { boolCompare, getCurrentWorkingDirectory, getGitDirectories, getGitStatusInfo, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed } from "../utils"


export const statusCmd = new Command('status')
    .description('show the working tree status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-s, --short', 'show statuses in a single line per repo')
    .addOption(new Option('-f, --filter <filter>', 'filter results').choices(Object.values(StatusFilterTypes)).default(StatusFilterTypes.all))
    .addOption(new Option('-o, --order <sort>', 'sort order').choices(Object.values(StatusOrderTypes)).default(StatusOrderTypes.status))
    .action(statusAction)


async function statusAction(opts: IStatusOptions) {
    const dir = opts.dir || getCurrentWorkingDirectory()
    const gitDirs = await getGitDirectories(dir);
    const gitStatuses = await mapAsync(gitDirs, getGitStatusInfo)


    const filtered = opts.filter == StatusFilterTypes.all
        ? gitStatuses
        : gitStatuses.filter(r => r.hasUnsavedChanges)

    const sorted = opts.order == StatusOrderTypes.alpha
        ? filtered.sort((a, b) => a.name.localeCompare(b.name))
        : filtered.sort((a, b) =>
            boolCompare(b.tooManyChanges, a.tooManyChanges) ||
            boolCompare(b.isDirty, a.isDirty) ||
            boolCompare(b.hasUnmergedCommits, a.hasUnmergedCommits) ||
            boolCompare(b.hasUnsyncedCommits, a.hasUnsyncedCommits)
        )

    sorted.forEach(repo => {
        const branch = printDim(printBlue(` (${repo.branch})`))
        if (opts.short) {
            if (repo.hasUnsavedChanges) {
                let msg = printBold(printBlue(repo.name)) + branch
                if (repo.isDirty) {
                    msg+= ` ${repo.modifiedCount.insertions}(+), ${repo.modifiedCount.deletions}(-)`
                } else {
                    msg+= ` ${repo.diffCommitCount.ahead}↑, ${repo.diffCommitCount.behind}↓`
                }
                console.log(msg)
            } else {
                console.log(printGreen(repo.name) + printDim(printGreen(` (${repo.branch})`)) + " Up to date")
            }
        } else {
            if (repo.hasUnsavedChanges) {
                console.log(printBold(printBlue(repo.name)) + branch)
                if (repo.tooManyChanges) {
                    console.log(printRed(`Too many changes - run manually with:\n$ git -C '${repo.path}' status`))
                } else if (repo.isDirty) {
                    console.log(repo.status)
                } else {
                    console.log(`${repo.diffCommitCount.ahead} commits(s) ahead, ${repo.diffCommitCount.behind} commits(s) behind`)
                }
                // add extra line if we're sorting by status
                if (opts.order == StatusOrderTypes.status) {
                    console.log()
                }
            } else {
                console.log(printGreen(repo.name))
            }
        }

    })
}
