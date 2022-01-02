export enum StatusOrderTypes {
    status = "status",
    alpha = "alpha"
}
export enum StatusFilterTypes {
    all = "all",
    dirty = "dirty"
}
export interface IStatusOptions {
    short?: boolean;
    dir?: string;
    filter: StatusFilterTypes;
    order: StatusOrderTypes
}

export interface IShortStatusInfo {
    status: string;
    tooManyChanges?: boolean;
}

export interface IGitStatus {
    path: string;
    name: string;
    branch: string;
    status: string;
    diffCommitCount: IDiffCommitCount;
    modifiedCount: IModifiedCount
    isDirty: boolean;            // has uncommitted files
    hasUnsavedChanges: boolean;  // isDirty or has unpushed commits
    tooManyChanges: boolean;     // changes too big to display
    hasUnmergedCommits: boolean; // has unpushed commits
    hasUnsyncedCommits: boolean; // has unpushed or pulled commits
}

export interface IDiffCommitCount {
    ahead: number;
    behind: number;
}

export interface IModifiedCount {
    files: number;
    insertions: number;
    deletions: number;
}

export class GitStatusGroups {
    tooManyChanges: Array<IGitStatus> = [];
    isDirty: Array<IGitStatus> = [];
    hasUnmergedCommits: Array<IGitStatus> = [];
    hasUnsyncedCommits: Array<IGitStatus> = [];
    upToDate: Array<IGitStatus> = [];
}
