// https://i.imgur.com/Gk91f09.png
export const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
} as const;

export const printDim = (text: string) => `${colors.dim}${text}${colors.reset}`;
export const printBold = (text: string) => `${colors.bright}${text}${colors.reset}`;
export const printBlue = (text: string) => `${colors.fg.blue}${text}${colors.reset}`;
export const printYellow = (text: string) => `${colors.fg.yellow}${text}${colors.reset}`;
export const printCyan = (text: string) => `${colors.fg.cyan}${text}${colors.reset}`;
export const printRed = (text: string) => `${colors.fg.red}${text}${colors.reset}`;
export const printGreen = (text: string) => `${colors.fg.green}${text}${colors.reset}`;
