export enum StatusOrderTypes {
    status = "status",
    alpha = "alpha"
}
export enum StatusFilterTypes {
    all = "all",
    dirty = "dirty"
}
export interface IStatusOptions {
    dir?: string;
    filter: StatusFilterTypes;
    sort: StatusOrderTypes
}
