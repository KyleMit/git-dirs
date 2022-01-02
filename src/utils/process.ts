import { promisify } from 'util';
import * as cp from 'child_process';
import { IExecOutput } from '../models';
const exec = promisify(cp.exec);

export const cmd = async (text: string): Promise<string> => {
    const { stdout, stderr } = await exec(text);
    if (stderr) throw new Error(stderr)
    return stdout
}

export const tryCmd = async (text: string): Promise<IExecOutput> => {
    try {
        const { stdout, stderr } = await exec(text);
        return {
            success: stdout,
            info: stderr
        }
    } catch (error) {
        return {
            error: String(error)
        }
    }
}
