import { Command } from "commander"
import { IDirectory, IFetchOptions, IGitStatus } from "../models/models";
import { colors, getCurrentWorkingDirectory, getGitDirectoriesWithNames, getGitStatusInfo, gitFetch, mapAsync, printBlue, printBold, printCyan, printDim, printGreen, printRed, printUnderscore, printYellow } from "../utils"


export const fetchCmd = new Command('fetch')
    .description('Download objects and refs from a remote repository')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-p, --prune', 'remove any remote-tracking references that no longer exist on the remote', false)
    .option('-n, --dry-run', 'show what would be done, without making any changes.', false)
    .action(fetchAction)



async function fetchAction(opts: IFetchOptions) {
    const dir = opts.dir || getCurrentWorkingDirectory()
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitDirsFetched = await mapAsync(gitDirs, async (dir) => {
        const resp = await gitFetch(dir.path, opts.prune, opts.dryRun);
        return {...dir, ...resp}
    })

    console.log()
    gitDirsFetched.forEach((dir) => {
        console.log(printBlue(printBold(dir.name)))
        const msg = dir.error ? printRed(dir.error) : dir.success || dir.info
        if (msg) { console.log(msg)}
    })
    console.log()
}
