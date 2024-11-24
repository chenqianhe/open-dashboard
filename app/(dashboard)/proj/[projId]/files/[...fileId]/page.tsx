import { getFileInfo } from "@/lib/openai/get-file-info";
import { FileStatusBadge } from "../components/FileStatusBadge";
import { 
  Calendar, 
  FileText,
  HardDrive,
  Tag,
} from "lucide-react";
import { DeleteFileButton } from "../components/DeleteFileButton";
import { DownloadFileButton } from "../components/DownloadFileButton";

export const runtime = "edge";

interface FilePageProps {
  params: {
    projId: string;
    fileId: string[];
  }
}

export default async function FilePage({ params }: FilePageProps) {
  const fileId = params.fileId[0];
  const file = await getFileInfo(params.projId, fileId);

  if (!file.success) {
    return <div>Error: {file.error}</div>;
  }

  const fileData = file.data;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm text-muted-foreground">FILE</h2>
            <h1 className="text-2xl font-semibold mt-1 break-all">{fileData.filename}</h1>
          </div>

          {/* Status section */}
          <div className="space-y-4">
            <div className="grid grid-cols-[160px_1fr] gap-4">
              {/* ID row */}
              <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>ID</span>
              </h3>
              <p className="text-sm break-all">{fileData.id}</p>
                
              {/* Status row */}
              <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Status</span>
              </h3>
              <div className="w-fit">
                <FileStatusBadge status={fileData.status} />
              </div>

              {/* Created at row */}
              <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Created at</span>
              </h3>
              <p className="text-sm">
                {new Date(fileData.created_at * 1000).toLocaleString()}
              </p>

              {/* Size row */}
              <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                <HardDrive className="h-4 w-4 flex-shrink-0" />
                <span>Size</span>
              </h3>
              <p className="text-sm">{formatBytes(fileData.bytes)}</p>

              {/* Purpose row */}
              <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4 flex-shrink-0" />
                <span>Purpose</span>
              </h3>
              <p className="text-sm">{fileData.purpose}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex-none h-fit">
        <hr />
        <div className="px-6 py-2 min-h-14 flex gap-2">
          <DownloadFileButton projId={params.projId} fileId={fileId}>
            Download File
          </DownloadFileButton>
          <DeleteFileButton projId={params.projId} fileId={fileId} />
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
