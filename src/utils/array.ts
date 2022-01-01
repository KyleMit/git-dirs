export const mapAsync = <T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> => {
    return Promise.all(array.map(callbackfn));
}

export const filterAsync = async <T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> => {
    const filterMap = await mapAsync(array, callbackfn);
    return array.filter((_, index) => filterMap[index]);
}

export const boolCompare = (a: boolean, b: boolean) => Number(a) - Number(b)
