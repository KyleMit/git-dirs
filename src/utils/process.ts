import { promisify } from 'util';
import cp from 'child_process';
const exec = promisify(cp.exec);

export const cmd = async (text: string): Promise<string> => {
    const { stdout, stderr } = await exec(text);
    if (stderr) throw new Error(stderr)
    return stdout
}
