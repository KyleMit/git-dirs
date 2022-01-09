import { statusCmd } from './status'
import { fetchCmd } from './fetch'
import { branchCmd } from './branch'
import { pullCmd } from './pull'
import { xargsCmd } from './xargs'
import { checkIgnoreCmd } from './check-ignore'
import { cleanCmd } from './clean'


export const commands = [
    statusCmd,
    fetchCmd,
    branchCmd,
    pullCmd,
    xargsCmd,
    checkIgnoreCmd,
    cleanCmd
]
