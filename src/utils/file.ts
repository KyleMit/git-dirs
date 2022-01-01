import { basename, dirname, join } from 'path';
import { promises as fs } from 'fs';
const { readdir } = fs

export const getDirectories = async (source: string): Promise<string[]> =>
  {
        const dirents = await readdir(source, { withFileTypes: true })
        return dirents
            .filter(f => f.isDirectory())
            .map(d => join(source, d.name));
    }

export const getCurrentWorkingDirectory = () => process.cwd()

export const getParentDirectory = (source: string) => dirname(source)

export const getDirectoryName = (source: string) => basename(source)
