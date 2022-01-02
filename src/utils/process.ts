import { promisify } from 'util';
import * as cp from 'child_process';
const exec = promisify(cp.exec);

export const cmd = async (text: string): Promise<string> => {
    const { stdout, stderr } = await exec(text);
    if (stderr) throw new Error(stderr)
    return stdout
}

export const tryCmd = async (text: string): Promise<[string, string]> => {
    const { stdout, stderr } = await exec(text);
    return [ stdout, stderr ]
}
