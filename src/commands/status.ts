import { Command, Option } from "commander"
import { GitStatusGroups, IStatusOptions, StatusFilterTypes, IGitStatus } from "../models";
import { formatNumber, getDirectoryPath, getGitDirectoriesWithNames, getGitStatusInfo, mapAsync } from "../utils";
import { colors, printBlue, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils/console";


export const statusCmd = new Command('status')
    .description('show the status of each repository')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-s, --short', 'show statuses in a single line per repo', false)
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .addOption(new Option('-f, --filter <filter>', 'filter results').choices(Object.values(StatusFilterTypes)).default(StatusFilterTypes.all))
    .action(statusAction)


async function statusAction(opts: IStatusOptions) {
    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);
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
    printGroup('Ahead', grouped.hasUnmergedCommits, printUnsyncedCommits)
    printGroup('Behind', grouped.hasUnsyncedCommits, printUnsyncedCommits)
    printGroup('Up To Date', grouped.upToDate, printUpToDate)

    console.log()
}
