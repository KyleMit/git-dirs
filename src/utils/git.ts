import { cmd, filterAsync, getDirectories, getDirectoryName, trimWhitespace } from "."

export interface IGitRepo {
    path: string;
    name: string;
}
export interface IGitStatusInfo extends IGitRepo {
    status: string;
    isDirty: boolean;
    tooManyChanges: boolean;
}

export const getGitStatusInfo = async (path: string): Promise<IGitStatusInfo> => {
    const name = getDirectoryName(path);
    try {
        const status = await getGitStatus(path)
        return {
            name,
            path,
            status,
            isDirty: status != "",
            tooManyChanges: status.length > 1_000
        }
    } catch (error) {
        return {
            name,
            path,
            status: 'Too Many Changes',
            isDirty: true,
            tooManyChanges: true
        }
    }

}

export const getGitStatus = async (path: string) => {
    // https://git-scm.com/docs/git-status
    const resp = await cmd(`git -C ${path} status -s`)
    return trimWhitespace(resp)
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
