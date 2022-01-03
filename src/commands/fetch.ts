import { Command } from "commander"
import { GitFetchGroups, IDirectory, IFetchOptions, IGitFetch, IGitStatus } from "../models/models";
import { colors, getCurrentWorkingDirectory, getGitDirectoriesWithNames, getGitStatusInfo, gitFetch, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const fetchCmd = new Command('fetch')
    .description('Download objects and refs from a remote repository')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-p, --prune', 'remove any remote-tracking references that no longer exist on the remote', false)
    .option('-n, --dry-run', 'show what would be done, without making any changes.', false)
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .action(fetchAction)



async function fetchAction(opts: IFetchOptions) {
    const dir = opts.dir || getCurrentWorkingDirectory()
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitDirsFetched: IGitFetch[] = await mapAsync(gitDirs, async (dir) => {
        const resp = await gitFetch(dir.path, opts.prune, opts.dryRun);
        return {...dir, ...resp}
    })

    const grouped: GitFetchGroups = gitDirsFetched.reduce((acc, cur) => {
        if (cur.error) { acc.error.push(cur); return acc; }
        if (cur.info) { acc.updated.push(cur); return acc; }

        acc.clean.push(cur)
        return acc;
    }, new GitFetchGroups())

    const printFetchResults = (dir: IGitFetch) => {
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

    printGroup('Fetch Error', grouped.error, printFetchResults)
    printGroup('Fetch Success', grouped.updated, printFetchResults)
    printGroup('Clean', grouped.clean, printFetchResults)
    console.log()
}
