import { Command, Option } from "commander"
import { stringify } from "querystring";
import { GitStatusGroups, IStatusOptions, StatusFilterTypes, StatusOrderTypes } from "../models";
import { IGitStatus } from "../models/models";
import { boolCompare, colors, formatNumber, getCurrentWorkingDirectory, getGitDirectories, getGitStatusInfo, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const statusCmd = new Command('status')
    .description('show the working tree status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-s, --short', 'show statuses in a single line per repo')
    .option('-h, --hide-headers', 'hide group headers in output')
    .addOption(new Option('-f, --filter <filter>', 'filter results').choices(Object.values(StatusFilterTypes)).default(StatusFilterTypes.all))
    // .addOption(new Option('-o, --order <sort>', 'sort order').choices(Object.values(StatusOrderTypes)).default(StatusOrderTypes.status))
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

    const repoTitle = (repo: IGitStatus) => `${colors.bright}${repo.name} ${printDim(`(${repo.branch})`)}`
    const modifiedRepoTitle = (repo: IGitStatus) => printBlue(repoTitle(repo))
    const unsyncedRepoTitle = (repo: IGitStatus) => printCyan(repoTitle(repo))
    const uptoDateRepoTitle = (repo: IGitStatus) => printGreen(repoTitle(repo))


    const modificationsCount = (repo: IGitStatus) => ` ${formatNumber(repo.modifiedCount.insertions)}(+) ${formatNumber(repo.modifiedCount.deletions)}(-)`
    const printHeader = (text: string) => {
        if (opts.hideHeaders) return;
        console.log('\n' + printYellow(text))
    }

    const printTooManyChanges = (repo: IGitStatus) => {
        const message = !opts.short
            ? `\n${printRed(`Too many changes ${printDim('- run manually with:')}`)}\n${printUnderscore(`$ git -C '${repo.path}' status`)}\n`
            : ` ${modificationsCount(repo)}`
        console.log(`${modifiedRepoTitle(repo)}${message}`)
    }

    const printChanges = (repo: IGitStatus) => {
        const message = !opts.short
            ? `\n${repo.status}`
            : ` ${modificationsCount(repo)}`
        console.log(`${modifiedRepoTitle(repo)}${message}`)
    }

    const printUnsyncedCommits = (repo: IGitStatus) => {
        const message = !opts.short
            ? `\n${repo.diffCommitCount.ahead} commits(s) ahead, ${repo.diffCommitCount.behind} commits(s) behind`
            : ` ${repo.diffCommitCount.ahead}↑ ${repo.diffCommitCount.behind}↓`
        console.log(`${unsyncedRepoTitle(repo)}${message}`)
    }

    const printUpToDate = (repo: IGitStatus) => {
        console.log(`${uptoDateRepoTitle(repo)} ${printDim('Up to date')}`)
    }

    const printGroup = (header: string, repos: Array<IGitStatus>, printFn: (repo: IGitStatus) => void) => {
        if (repos.length) { printHeader(header) }
        repos.forEach(printFn)
    }

    printGroup('Too Many Changes', grouped.tooManyChanges, printTooManyChanges)
    printGroup('Unsaved Changes', grouped.isDirty, printChanges)
    printGroup('Unpushed Commits', grouped.hasUnmergedCommits, printUnsyncedCommits)
    printGroup('Behind Origin', grouped.hasUnsyncedCommits, printUnsyncedCommits)
    printGroup('Up To Date', grouped.upToDate, printUpToDate)

    console.log()
}
