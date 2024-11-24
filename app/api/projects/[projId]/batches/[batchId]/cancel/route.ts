import { cancelBatch } from "@/lib/openai/cancel-batch";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest, { params }: { params: { projId: string, batchId: string } }) {
    const result = await cancelBatch(params.projId, params.batchId);
    return NextResponse.json(result);
}
