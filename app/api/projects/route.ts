import { NextResponse } from 'next/server';
import { Project } from '@/common/type/project';
import { getProjects } from '@/lib/get-projects';

export const runtime = 'edge';

export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(projects as Project[]);
    } catch {
        return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
        );
    }
} 