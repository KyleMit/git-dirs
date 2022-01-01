import { Command } from "commander"
import { cmd } from "../utils"

export const statusCmd = new Command('status')
    .description('show the working tree status')
    .action(async (_) => {
        try {
            const result = await cmd("git status")
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    })
