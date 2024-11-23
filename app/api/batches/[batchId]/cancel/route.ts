import { cancelBatch } from "@/lib/openai/cancel-batch";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest, { params }: { params: { batchId: string } }) {
    const batchId = params.batchId;
    const result = await cancelBatch(batchId);
    return NextResponse.json(result);
}
