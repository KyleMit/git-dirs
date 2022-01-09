import { Command } from "commander"
import { GitFetchGroups, ICleanOptions, IGitFetch } from "../models";
import { getDirectoryPath, getGitDirectoriesWithNames, gitClean, mapAsync } from "../utils";
import { printBlue, printBold, printRed, printYellow } from "../utils/console";


export const cleanCmd = new Command('clean')
    .description('Remove ignored files')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-n, --dry-run', 'show what would be done, without making any changes.', false)
    .option('-f, --force', 'required to modify changes to reflect risk.', false)
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .action(cleanAction)



async function cleanAction(opts: ICleanOptions) {
    // verify options
    if (!opts.dryRun && !opts.force) {
        console.log(printYellow("Must run with one of the following options:\n  -n|--dry-run\n  -f|--force options\n"))
        return;
    }
    if (opts.dryRun && opts.force) {
        console.log(printYellow("May only run with either of the following options:\n  -n|--dry-run\n  -f|--force options\n"))
        return;
    }


    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitDirsFetched: IGitFetch[] = await mapAsync(gitDirs, async (dir) => {
        const resp = await gitClean(dir.path, opts.dryRun);
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
    printGroup(opts.dryRun ? 'Example' : 'Cleaned', grouped.updated, printFetchResults)
    printGroup('Unchanged', grouped.clean, printFetchResults)
    console.log()
}
