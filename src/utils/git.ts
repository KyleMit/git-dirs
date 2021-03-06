import { cmd, filterAsync, getDirectories, getDirectoryName, trimNewLines, trimWhitespace, tryCmd } from "."
import { IBranch, IDiffCommitCount, IDirectory, IExecOutput, IGitStatus, IModifiedCount, IShortStatusInfo } from "../models";




export const getGitShortStatus = async (path: string): Promise<IShortStatusInfo> => {
    // https://git-scm.com/docs/git-status
    try {
        const resp = await cmd(`git -C ${path} status -s`)
        return { status: trimNewLines(resp) }
    } catch (error) {
        return { status: "", tooManyChanges: true}
    }

}

export const getCurrentBranch = async (path: string): Promise<string> => {
    // https://git-scm.com/docs/git-branch#Documentation/git-branch.txt---show-current
    const resp = await cmd(`git -C ${path} branch --show-current`)
    return trimWhitespace(resp) || 'Detached Head'
}

export const getLocalBranches = async (path: string): Promise<IBranch[]> => {
    // https://git-scm.com/docs/git-branch#Documentation/git-branch.txt---list
    const resp = await cmd(`git -C ${path} branch --list`)
    const branches = trimNewLines(resp).split('\n').map((b) => {
        const isCurrent = b.startsWith('*')
        const name = b.replace(/\*|\s/g,'')
        return {name, isCurrent}
    })
    return branches
}

export const gitFetch = async (path: string, prune: boolean, dryRun: boolean): Promise<IExecOutput> => {
    // https://git-scm.com/docs/git-fetch
    const { success, info, error} = await tryCmd(`git -C ${path} fetch${prune ? ' --prune' : ''}${dryRun ? ' --dry-run' : ''}`)
    return {
        success: trimWhitespace(success),
        info: trimWhitespace(info),
        error: trimWhitespace(error)
    }
}

export const gitClean = async (path: string, dryRun: boolean): Promise<IExecOutput> => {
    // https://git-scm.com/docs/git-clean
    const { success, info, error} = await tryCmd(`git -C ${path} clean -dX ${dryRun ? ' --dry-run' : '--force'}`)
    return {
        success: trimWhitespace(success),
        info: trimWhitespace(info),
        error: trimWhitespace(error)
    }
}


export const gitCheckIgnore = async (path: string): Promise<IExecOutput> => {
    // clean is easier to parse than check-ignore
    // https://git-scm.com/docs/git-clean
    const { success, info, error} = await tryCmd(`git -C ${path} clean -dX --dry-run`)
    const files = success?.replace(/Would remove /g, '')
    return {
        success: trimWhitespace(files),
        info: trimWhitespace(info),
        error: trimWhitespace(error)
    }
}

export const gitPull = async (path: string, dryRun: boolean): Promise<IExecOutput> => {
    // https://git-scm.com/docs/git-pull
    const { success, info, error} = await tryCmd(`git -C ${path} pull${dryRun ? ' --dry-run' : ''}`)
    return {
        success: trimWhitespace(success),
        info: trimWhitespace(info),
        error: trimWhitespace(error)
    }
}

export const gitExec = async (path: string, cmd: string): Promise<IExecOutput> => {
    // https://git-scm.com/docs/git-pull
    const { success, info, error} = await tryCmd(`git -C "${path}" ${cmd}`)
    return {
        success: trimWhitespace(success),
        info: trimWhitespace(info),
        error: trimWhitespace(error)
    }
}

export const getModifiedCounts = async (path: string): Promise<IModifiedCount> => {
    // https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---shortstat
    const {success: stats} = await tryCmd(`git -C ${path} diff --shortstat`)

    // if there's no line, there are no changes
    if (!stats) { return {files: 0, insertions: 0, deletions: 0} }

    // ex. 4 files changed, 15 insertions(+), 5 deletions(-)
    // ex. 8 files changed, 595 deletions(-)
    const files = Number(stats.match(/(\d+) files/)?.[1] || 0)
    const insertions = Number(stats.match(/(\d+) insertions/)?.[1] || 0)
    const deletions = Number(stats.match(/(\d+) deletions/)?.[1] || 0)

    return { files, insertions, deletions }
}

export const getAheadBehindCount = async (path: string, branch?: string): Promise<IDiffCommitCount> => {
    // https://git-scm.com/docs/git-rev-list#Documentation/git-rev-list.txt---count
    try {
        const resp = await cmd(`git -C ${path} rev-list --count --left-right ${branch || 'HEAD'}...@{upstream}`)
        const matches = resp.match(/(\d*)\s*(\d*)/)
        const [_, ahead, behind] = matches || []
        return {
            ahead: Number(ahead),
            behind: Number(behind)
        }
    } catch (error) {
        // fatal: no upstream configured for branch 'feature'
        return {ahead: 0, behind: 0}
    }
}

export const getRemoteDefaultBranchName = async (path: string): Promise<string> => {
    // https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---abbrev-refstrictloose
    try {
        const resp = await cmd(`git -C ${path} rev-parse --abbrev-ref origin/HEAD`)
        const branch = trimWhitespace(resp).replace('origin/', '')
        return branch
    } catch (error) {
        return ""
    }
}

export const getLocalDefaultBranchName = async (path: string): Promise<string> => {
    // https://git-scm.com/docs/git-config#Documentation/git-config.txt-initdefaultBranch
    try {
        const resp = await cmd(`git -C ${path} config --get init.defaultBranch`)
        const branch = trimWhitespace(resp)
        return branch
    } catch (error) {
        return ""
    }
}


export const isGitDirectory = async (path: string): Promise<boolean> => {
    try {
        // https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---is-inside-work-tree
        const resp = await cmd(`git -C ${path} rev-parse --is-inside-work-tree`)
        return trimWhitespace(resp) == 'true'
    } catch (error) {
        return false;
    }
}


const getGitDirectories = async (path: string): Promise<string[]> => {
    if (await isGitDirectory(path)) return [path];
    const dirs = await getDirectories(path);
    const gitDirs = await filterAsync(dirs, isGitDirectory)
    return gitDirs
}

export const getGitDirectoriesWithNames = async (path: string): Promise<IDirectory[]> => {
    const gitDirs = await getGitDirectories(path)

    return gitDirs.map(path => ({
        path,
        name: getDirectoryName(path)
    }))
}

export const getGitStatusInfo = async ({path, name}: IDirectory): Promise<IGitStatus> => {

    const [branch, statusInfo, diffCommitCount, modifiedCount] = await Promise.all([
        getCurrentBranch(path),
        getGitShortStatus(path),
        getAheadBehindCount(path),
        getModifiedCounts(path)
    ])

    const { status, tooManyChanges } = statusInfo
    const isDirty = Boolean(modifiedCount.files)
    const hasUnmergedCommits = Boolean(diffCommitCount.ahead)
    const hasUnsyncedCommits = Boolean(diffCommitCount.ahead || diffCommitCount.behind)
    const hasUnsavedChanges = isDirty || hasUnmergedCommits

    return {
        name,
        path,
        status,
        branch,
        diffCommitCount,
        modifiedCount,
        isDirty,
        hasUnsavedChanges,
        tooManyChanges: tooManyChanges || status.length > 1_000,
        hasUnmergedCommits: hasUnmergedCommits,
        hasUnsyncedCommits: hasUnsyncedCommits
    }
}
