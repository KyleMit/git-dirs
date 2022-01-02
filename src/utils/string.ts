export const trimWhitespace = (str?: string) => str?.replace(/^\s+|\s+$/g, '') ?? "";
export const trimNewLines = (str: string) => str.replace(/^\n+|\n+$/g, '');
export const formatNumber = (num: number): string => num < 1_000 ? String(num) : `${Math.floor(num / 1_000)}k`;

