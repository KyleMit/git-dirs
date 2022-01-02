import { Command, Option } from "commander"
import { GitStatusGroups, IStatusOptions, StatusFilterTypes, StatusOrderTypes } from "../models";
import { IGitStatus } from "../models/models";
import { boolCompare, formatNumber, getCurrentWorkingDirectory, getGitDirectories, getGitStatusInfo, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const statusCmd = new Command('status')
    .description('show the working tree status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-s, --short', 'show statuses in a single line per repo')
    .option('-h, --hide-headers', 'hide group headers in output')
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

    const grouped: GitStatusGroups = filtered.reduce((acc, cur) => {
            if (cur.tooManyChanges) { acc.tooManyChanges.push(cur); return acc; }
            if (cur.isDirty) { acc.isDirty.push(cur); return acc; }
            if (cur.hasUnmergedCommits) { acc.hasUnmergedCommits.push(cur); return acc; }
            if (cur.hasUnsyncedCommits) { acc.hasUnsyncedCommits.push(cur); return acc; }

            acc.upToDate.push(cur)
            return acc;
    }, new GitStatusGroups())

    const modifiedRepo = (r: IGitStatus) => `${printBold(printBlue(r.name))} ${printDim(printBlue(`(${r.branch})`))}`
    const modificationsCount = (r: IGitStatus) => ` ${formatNumber(r.modifiedCount.insertions)}(+) ${formatNumber(r.modifiedCount.deletions)}(-)`
    const printHeader = (text: string) => {
        if (opts.hideHeaders) return;
        console.log('\n' + printYellow(text))
    }



    printHeader('Unsaved Changes')
    grouped.tooManyChanges.forEach(repo => {
        const message = !opts.short
            ? `\n${printRed(`Too many changes ${printDim('- run manually with:')}`)}\n${printUnderscore(`$ git -C '${repo.path}' status`)}\n`
            : ` ${modificationsCount(repo)}`
        console.log(`${modifiedRepo(repo)}${message}`)
    })

    grouped.isDirty.forEach(repo => {
        const message = !opts.short
            ? `\n${repo.status}`
            : ` ${modificationsCount(repo)}`
        console.log(`${modifiedRepo(repo)}${message}`)
    })

    const logSync = (r: IGitStatus) => {
        const message = !opts.short
            ? `\n${r.diffCommitCount.ahead} commits(s) ahead, ${r.diffCommitCount.behind} commits(s) behind`
            : ` ${r.diffCommitCount.ahead}↑ ${r.diffCommitCount.behind}↓`
        console.log(`${modifiedRepo(r)}${message}`)
    }

    printHeader('Unpushed Commits')
    grouped.hasUnmergedCommits.forEach(logSync)

    printHeader('Behind Origin')
    grouped.hasUnsyncedCommits.forEach(logSync)

    printHeader('Up To Date')
    grouped.upToDate.forEach(repo => {
        console.log(`${printGreen(repo.name)} (${printDim(printGreen(repo.branch))}) ${printDim('Up to date')}`)
    })

    console.log()
}
