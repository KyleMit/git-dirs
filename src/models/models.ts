export enum StatusOrderTypes {
    status = "status",
    alpha = "alpha"
}
export enum StatusFilterTypes {
    all = "all",
    dirty = "dirty"
}

export interface IExecOutput {
    success?: string;
    info?: string;
    error?: string;
}

export interface IBaseOptions {
    dir?: string;
}

export interface IGroupedOutput extends IBaseOptions {
    hideHeaders: boolean;
}


export interface IModifyOptions {
    dryRun: boolean;
    force: boolean;
}

export interface IStatusOptions extends IGroupedOutput {
    short: boolean;
    filter: StatusFilterTypes;
    order: StatusOrderTypes
}

export interface IFetchOptions extends IGroupedOutput, IModifyOptions {
    prune: boolean;
}

export interface IBranchOptions extends IGroupedOutput {
}

export interface IPullOptions extends IGroupedOutput, IModifyOptions {
}

export interface ICleanOptions extends IGroupedOutput, IModifyOptions {
}

export interface IXargsOptions extends IGroupedOutput {
}


export interface IShortStatusInfo {
    status: string;
    tooManyChanges?: boolean;
}

export interface IDirectory {
    path: string;
    name: string;
}

export interface IGitStatus extends IDirectory {
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

export interface IGitFetch extends IDirectory, IExecOutput {}

export interface IGitBranch extends IDirectory {
    branches: IBranchWithStatus[];
    hasMultiple: boolean;
    hasOutOfDate: boolean;
}

export interface IBranch {
    name: string;
    isCurrent: boolean;
}

export interface IBranchWithStatus extends IBranch, IDiffCommitCount {
    isDefault: boolean;
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

export class GitFetchGroups {
    error: Array<IGitFetch> = [];
    updated: Array<IGitFetch> = [];
    clean: Array<IGitFetch> = [];
}

export class GitPullGroups {
    error: Array<IGitFetch> = [];
    updated: Array<IGitFetch> = [];
}

export class GitBranchGroups {
    outOfDate: Array<IGitBranch> = [];
    multiple: Array<IGitBranch> = [];
    upToDate: Array<IGitBranch> = [];
}
