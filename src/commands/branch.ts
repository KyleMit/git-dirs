import { Command } from "commander"
import { GitBranchGroups, IBranchOptions, IBranchWithStatus, IGitBranch } from "../models";
import { boolCompare, getAheadBehindCount, getDirectoryPath, getGitDirectoriesWithNames, getLocalBranches, getRemoteDefaultBranchName, mapAsync } from "../utils"
import { printBlue, printBold, printCyan, printGreen, printYellow} from "../utils/console";


export const branchCmd = new Command('branch')
    .description('List local branches and status')
    .option('-d, --dir <path>', 'path other than current directory')
    .option('-h, --hide-headers', 'hide group headers in output', false)
    .action(branchAction)



async function branchAction(opts: IBranchOptions) {
    const dir = getDirectoryPath(opts.dir)
    const gitDirs = await getGitDirectoriesWithNames(dir);

    const gitBranchesWithStatus = await mapAsync(gitDirs, async (dir) => {
        const defaultBranchName = await getRemoteDefaultBranchName(dir.path);
        const branches = await getLocalBranches(dir.path);
        const branchesWithStatus = await mapAsync(branches, async (b) => {
            const counts = await getAheadBehindCount(dir.path, b.name)
            const branchInfo: IBranchWithStatus = {
                ...b,
                ...counts,
                isDefault: b.name == defaultBranchName
            }
            return branchInfo
        })
        return {
            ...dir,
            branches: branchesWithStatus,
            hasOutOfDate: branchesWithStatus.some(b => b.ahead || b.behind),
            hasMultiple: branchesWithStatus.length > 1
        }
    })

    const grouped: GitBranchGroups = gitBranchesWithStatus.reduce((acc, cur) => {
        if (cur.hasMultiple) { acc.multiple.push(cur); return acc; }
        if (cur.hasOutOfDate) { acc.outOfDate.push(cur); return acc; }

        acc.upToDate.push(cur)
        return acc;
    }, new GitBranchGroups())

    const printBranchResults = (repo: IGitBranch) => {

        const printDiff = (b: IBranchWithStatus) => ` ${b.ahead}↑ ${b.behind}↓`
        let header = printBlue(printBold(repo.name));
        if (!repo.hasMultiple) {
            header += printCyan(printBold(` (${repo.branches[0].name})`))
            if (repo.hasOutOfDate) {
                header += ` ${printDiff(repo.branches[0])}`
            }
        }
        console.log(header)
        if (!repo.hasMultiple) return;

        repo.branches
            .sort((a,b) => boolCompare(b.isCurrent, a.isCurrent) || boolCompare(b.isDefault, a.isDefault) || a.name.localeCompare(b.name))
            .forEach((b) => {
                const msg = b.isCurrent ? '* ' + printGreen(b.name) : b.isDefault ? '☆ ' + printCyan(b.name) : '  ' + b.name
                console.log(`${msg} ${printDiff(b)}`)
            })
    }

    const printHeader = (text: string) => {
        if (opts.hideHeaders) return;
        console.log('\n' + printYellow(text))
    }

    const printGroup = (header: string, repos: Array<IGitBranch>, printFn: (repo: IGitBranch) => void) => {
        if (repos.length) { printHeader(header) }
        repos.forEach(printFn)
    }

    printGroup('Multiple', grouped.multiple, printBranchResults)
    printGroup('Out of Date', grouped.outOfDate, printBranchResults)
    printGroup('Current', grouped.upToDate, printBranchResults)
    console.log()
}
