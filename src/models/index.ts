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

export interface IGitStatus {
    path: string;
    name: string;
    branch: string;
    status: string;
    isDirty: boolean;
    tooManyChanges: boolean;
}
