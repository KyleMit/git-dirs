import { promisify } from 'util';
import cp from 'child_process';
const exec = promisify(cp.exec);

interface IExecOutput {
    stdout: string;
    stderr: string;
}

export const cmd = async (text: string): Promise<IExecOutput> => {
    const { stdout, stderr } = await exec(text);
    return { stdout, stderr }
}
