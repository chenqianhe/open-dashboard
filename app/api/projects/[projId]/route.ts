import { getBatchesKeyPerfix, getBatchKeyPerfix, getConfigKey, getFileInfoKeyPerfix, getFilesKeyPerfix, getProjectsKey } from "@/common/key/get-key";
import { Project } from "@/common/type/project";
import { getBaseUrlAndKey } from "@/lib/get-baseurl-and-key";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function DELETE(request: Request, { params }: { params: { projId: string } }) {
  const { projId } = params;
  const ctx = getRequestContext();
  const kv = ctx.env.OPEN_DASHBOARD_KV;

  try {
    const { apiKey } = await getBaseUrlAndKey(kv, projId);

    const promises = [];

    try {
        const [
            projects,
            batches,
            files,
            batchInfos,
            fileInfos
        ] = await Promise.all([
            kv.get<Project[]>(getProjectsKey(), "json").then(p => (p ?? []).filter(project => project.id !== projId)),
            kv.list({ prefix: getBatchesKeyPerfix(apiKey) }),
            kv.list({ prefix: getFilesKeyPerfix(apiKey) }),
            kv.list({ prefix: getBatchKeyPerfix(apiKey) }),
            kv.list({ prefix: getFileInfoKeyPerfix(apiKey) })
        ]);
        for (const batch of batches.keys) {
            promises.push(kv.delete(batch.name));
        }
        for (const file of files.keys) {
            promises.push(kv.delete(file.name));
        }
        for (const batchInfo of batchInfos.keys) {
            promises.push(kv.delete(batchInfo.name));
        }
        for (const fileInfo of fileInfos.keys) {
            promises.push(kv.delete(fileInfo.name));
        }

        promises.push(kv.put(getProjectsKey(), JSON.stringify(projects)));
        promises.push(kv.delete(getConfigKey(projId)));

        await Promise.all(promises);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
    }

  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ success: true });
}
