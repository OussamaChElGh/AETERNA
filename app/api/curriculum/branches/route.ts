import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { BranchCurriculum, BranchSummary, getBranchSummary } from '@/lib/curriculum/schema';

const CURRICULUM_DIR = path.join(process.cwd(), 'data', 'curriculum');

export async function GET() {
  try {
    const branches: BranchSummary[] = [];

    try {
      const files = await fs.readdir(CURRICULUM_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        try {
          const raw = await fs.readFile(path.join(CURRICULUM_DIR, file), 'utf-8');
          const branch: BranchCurriculum = JSON.parse(raw);
          branches.push(getBranchSummary(branch));
        } catch {
          // skip malformed files
        }
      }
    } catch {
      // directory doesn't exist
    }

    return NextResponse.json({ branches });
  } catch (error) {
    console.error('Error listing branches:', error);
    return NextResponse.json({ error: 'Error listing branches' }, { status: 500 });
  }
}
