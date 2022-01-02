import { cmd, filterAsync, getDirectories, getDirectoryName, trimWhitespace } from "."
import { IGitStatus } from "../models";



export const getGitStatusInfo = async (path: string): Promise<IGitStatus> => {
    const name = getDirectoryName(path);
    const branch = await getCurrentBranch(path)
    const { status, tooManyChanges } = await getGitStatus(path)

    return {
        name,
        path,
        status,
        branch,
        isDirty: tooManyChanges || status != "",
        tooManyChanges: tooManyChanges || status.length > 1_000
    }
}

export const getGitStatus = async (path: string) => {
    // https://git-scm.com/docs/git-status
    try {
        const resp = await cmd(`git -C ${path} status -s`)
        return { status: trimWhitespace(resp) }
    } catch (error) {
        return { status: "", tooManyChanges: true}
    }

}

export const getCurrentBranch = async (path: string) => {
    // https://git-scm.com/docs/git-branch#Documentation/git-branch.txt---show-current
    const resp = await cmd(`git -C ${path} branch --show-current`)
    return trimWhitespace(resp) || 'Detached Head'
}

export const isGitDirectory = async (path: string) => {
    try {
        // https://git-scm.com/docs/git-rev-parse
        const resp = await cmd(`git -C ${path} rev-parse --is-inside-work-tree`)
        return trimWhitespace(resp) == 'true'
    } catch (error) {
        return false;
    }
}

export const getGitDirectories = async (path: string): Promise<string[]> => {
    if (await isGitDirectory(path)) return [path];
    const dirs = await getDirectories(path);
    const gitDirs = await filterAsync(dirs, isGitDirectory)
    return gitDirs
}
