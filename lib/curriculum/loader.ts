import fs from 'fs/promises';
import path from 'path';
import { BranchCurriculum } from './schema';

const CURRICULUM_DIR = path.join(process.cwd(), 'data', 'curriculum');

export async function loadAllBranches(): Promise<BranchCurriculum[]> {
  const branches: BranchCurriculum[] = [];
  try {
    const files = await fs.readdir(CURRICULUM_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(CURRICULUM_DIR, file), 'utf-8');
        const branch: BranchCurriculum = JSON.parse(raw);
        branches.push(branch);
      } catch {
        // skip malformed
      }
    }
  } catch {
    // dir missing
  }
  return branches;
}

export async function loadBranch(branchId: string): Promise<BranchCurriculum | null> {
  try {
    const filePath = path.join(CURRICULUM_DIR, `${branchId}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
