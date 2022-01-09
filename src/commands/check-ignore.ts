import { Command } from "commander"
import { GitFetchGroups, IDirectory, IFetchOptions, IGitFetch, IGitStatus, IGroupedOutput } from "../models";
import { colors, getCurrentWorkingDirectory, getDirectoryPath, getGitDirectoriesWithNames, getGitStatusInfo, gitCheckIgnore, gitFetch, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const checkIgnoreCmd = new Command('check-ignore')
    .description('Show files ignored by git')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .action(checkIgnoreAction)



async function checkIgnoreAction(opts: IGroupedOutput) {
    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitDirsFetched: IGitFetch[] = await mapAsync(gitDirs, async (dir) => {
        const resp = await gitCheckIgnore(dir.path);
        return {...dir, ...resp}
    })

    const grouped: GitFetchGroups = gitDirsFetched.reduce((acc, cur) => {
        if (cur.error) { acc.error.push(cur); return acc; }
        if (cur.success) { acc.updated.push(cur); return acc; }

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

    printGroup('Error', grouped.error, printFetchResults)
    printGroup('Ignored Files', grouped.updated, printFetchResults)
    printGroup('Clean', grouped.clean, printFetchResults)
    console.log()
}
