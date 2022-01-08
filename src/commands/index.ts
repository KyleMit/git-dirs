import { statusCmd } from './status'
import { fetchCmd } from './fetch'
import { branchCmd } from './branch'
import { pullCmd } from './pull'


export const commands = [
    statusCmd,
    fetchCmd,
    branchCmd,
    pullCmd
]
