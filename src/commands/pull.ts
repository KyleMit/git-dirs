import { Command } from "commander"
import { GitFetchGroups, GitPullGroups, IBaseOptions, IDirectory, IFetchOptions, IGitFetch, IGitStatus, IPullOptions } from "../models/models";
import { colors, getCurrentWorkingDirectory, getDirectoryPath, getGitDirectoriesWithNames, getGitStatusInfo, gitFetch, gitPull, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const pullCmd = new Command('pull')
    .description('Download objects and refs from a remote repository')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .option('-n, --dry-run', 'show what would be done, without making any changes.', false)
    .action(pullAction)



async function pullAction(opts: IPullOptions) {
    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);
    const gitStatuses = await mapAsync(gitDirs, getGitStatusInfo)

    const behindRepos = gitStatuses.filter(r => r.diffCommitCount.ahead == 0 && r.diffCommitCount.behind > 0 && !r.isDirty)

    const gitDirsPulled: IGitFetch[] = await mapAsync(behindRepos, async (dir) => {
        const resp = await gitPull(dir.path, opts.dryRun);
        return {...dir, ...resp}
    })

    const grouped: GitPullGroups = gitDirsPulled.reduce((acc, cur) => {
        if (cur.error) { acc.error.push(cur); return acc; }

        acc.updated.push(cur)
        return acc;
    }, new GitPullGroups())

    const printPullResults = (dir: IGitFetch) => {
        console.log(printBlue(printBold(dir.name)))
        const msg = dir.error ? printRed(dir.error) : dir.success || dir.info
        if (msg) { console.log(msg + '\n')}
    }

    const printHeader = (text: string) => {
        if (opts.hideHeaders) return;
        console.log('\n' + printYellow(text))
    }

    const printGroup = (header: string, repos: Array<IGitFetch>, printFn: (repo: IGitFetch) => void) => {
        if (repos.length) { printHeader(header) }
        repos.forEach(printFn)
    }

    printGroup('Pull Error', grouped.error, printPullResults)
    printGroup('Pull Success', grouped.updated, printPullResults)
    console.log()
}
