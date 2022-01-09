import { Command } from "commander"
import { GitPullGroups, IXargsOptions, IGitFetch } from "../models";
import { getDirectoryPath, getGitDirectoriesWithNames, getGitStatusInfo, gitExec, mapAsync, printBlue, printBold, printRed, printYellow } from "../utils"


export const xargsCmd = new Command('xargs')
    .argument('<command>', 'command to execute on all repos')
    .description('Download objects and refs from a remote repository')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .action(xargsAction)



async function xargsAction(command: string, opts: IXargsOptions) {
    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitDirsPulled: IGitFetch[] = await mapAsync(gitDirs, async (dir) => {
        const resp = await gitExec(dir.path, command);
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

    printGroup('Error', grouped.error, printPullResults)
    printGroup('Success', grouped.updated, printPullResults)
    console.log()
}
