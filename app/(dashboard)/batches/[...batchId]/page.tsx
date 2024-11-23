import { getBatchDetail } from "@/lib/openai/get-batch-detail";
import { BatchStatusBadge } from "../components/BatchStatusBadge";
import OpenAI from "openai";
import { 
  Clock, 
  Calendar, 
  Link2, 
  Timer,
  CheckCircle2,
  BarChart3,
  FileText,
  FileOutput,
  FileWarning,
  ExternalLink
} from "lucide-react";
import { Fragment } from 'react';
import { CancelBatchButton } from "../components/CancelBatchButton";
import { DownloadOutputButton } from "../components/DownloadOutputButton";
import Link from "next/link";
import { getFileInfo } from "@/lib/openai/get-file-info";

export const runtime = "edge";

interface BatchPageProps {
  params: {
    batchId: string[];
  }
}

interface BatchTimelineEvent {
  timestamp: number;
  status: 'created' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export default async function BatchPage({ params }: BatchPageProps) {
  const batchId = params.batchId[0];
  const batch = await getBatchDetail(batchId);

  if (!batch.success) {
    return <div>Error: {batch.error}</div>;
  }

  const batchData: OpenAI.Batches.Batch = batch.data;


  let outputFileName: string = '';
  let errorFileName: string = '';
  if (batchData?.output_file_id) {
    const outputFileInfo = await getFileInfo(batchData.output_file_id);
    if (outputFileInfo.success) {
      outputFileName = outputFileInfo.data.filename;
    } 
  }
  if (batchData?.error_file_id) {
    const errorFileInfo = await getFileInfo(batchData.error_file_id);
    if (errorFileInfo.success) {
      errorFileName = errorFileInfo.data.filename;
    }
  }


  // Generate timeline events
  const timelineEvents = ([
    { timestamp: batchData.created_at ?? 0, status: 'created' },
    { timestamp: batchData.in_progress_at ?? 0, status: 'in_progress' },
    { timestamp: batchData.completed_at ?? 0, status: 'completed' },
    { timestamp: batchData.failed_at ?? 0, status: 'failed' },
    { timestamp: batchData.cancelled_at ?? 0, status: 'cancelled' },
  ] satisfies BatchTimelineEvent[]).filter(event => event.timestamp);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6">
        <div className="space-y-6">
        <div>
          <h2 className="text-sm text-muted-foreground">BATCH</h2>
          <h1 className="text-2xl font-semibold mt-1">{batchId}</h1>
        </div>

        {/* Status section */}
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] gap-4">
            {/* Status row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Status</span>
            </h3>
            <div className="w-fit -top-2">
                <BatchStatusBadge status={batchData.status} />
            </div>

            {/* Created at row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Created at</span>
            </h3>
            <p className="text-sm">{new Date(batchData.created_at * 1000).toLocaleString()}</p>

            {/* Endpoint row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <Link2 className="h-4 w-4 flex-shrink-0" />
              <span>Endpoint</span>
            </h3>
            <p className="text-sm">{batchData.endpoint}</p>

            {/* Completion window row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <Timer className="h-4 w-4 flex-shrink-0" />
              <span>Completion window</span>
            </h3>
            <p className="text-sm">{batchData.completion_window}</p>

            {/* Completion time row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Completion time</span>
            </h3>
            <p className="text-sm">
              {batchData.completed_at || batchData.failed_at || batchData.cancelled_at
                ? getCompletionTime(batchData.created_at, batchData.completed_at || batchData.failed_at || batchData.cancelled_at || batchData.created_at)
                : 'In progress'}
            </p>

            {/* Request counts row */}
            <h3 className="text-xs text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span>Request counts</span>
            </h3>
            <p className="text-sm">
              {batchData.request_counts?.completed} completed, &nbsp;
              {batchData.request_counts?.failed} failed of {batchData.request_counts?.total} total requests
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-sm text-muted-foreground mb-2">Files</h3>
          <div className="grid grid-cols-[160px_1fr] gap-4">
            {[
              { label: 'Input File', fileId: batchData.input_file_id, icon: FileText, fileName: "" },
              { label: 'Output File', fileId: batchData.output_file_id, icon: FileOutput, fileName: outputFileName },
              { label: 'Error File', fileId: batchData.error_file_id, icon: FileWarning, fileName: errorFileName }
            ].map(({ label, fileId, icon: Icon, fileName }) => fileId && (
              <Fragment key={label}>
                <h3 className="text-xs text-muted-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{label}</span>
                </h3>
                <Link
                  href={`/files/${fileId}`} 
                  target="_blank"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span 
                    className="text-sm text-primary"
                  >
                    {fileName || fileId}
                  </span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </Link>
              </Fragment>
            ))}
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-8">
          {/* Date header */}
          <div className="text-sm text-muted-foreground">
            {new Date(timelineEvents[0]?.timestamp * 1000).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>

          {/* Timeline events */}
          {timelineEvents.map((event, index) => (
            <div key={event.status} className="flex items-start">
              {/* Time column */}
              <div className="flex-none w-[90px] text-muted-foreground">
                <time className="text-sm font-mono">
                  {new Date(event.timestamp * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </time>
              </div>
              
              {/* Timeline point and text */}
              <div className="relative flex items-center">
                {/* Vertical line */}
                {index !== timelineEvents.length - 1 && (
                  <div 
                    className="absolute left-[6px] top-[24px] h-[40px] w-[2px]" 
                    style={{ 
                      background: 'linear-gradient(to bottom, rgb(229 231 235) 50%, transparent 50%)',
                      backgroundSize: '2px 6px'
                    }} 
                  />
                )}
                {/* Timeline point container */}
                <div className="w-[14px] mr-4 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[14px] w-[14px] rounded-full bg-background border-[3px] border-foreground" />
                </div>
                {/* Event text */}
                <span className="text-base font-normal text-foreground">
                  Batch {event.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="flex-none h-fit">
        <hr />
        <div className="px-6 p-2 min-h-14">
          {batchData.status !== 'cancelled' && batchData.status !== 'completed' && batchData.status !== 'failed' && <CancelBatchButton batchId={batchId} />}
          {(batchData.status === 'completed' || 
            batchData.status === 'failed' || 
            batchData.status === 'cancelled') && 
            (batchData.output_file_id || batchData.error_file_id) && (
              <DownloadOutputButton fileId={batchData.output_file_id || batchData.error_file_id!}>
                Download Output
              </DownloadOutputButton>
            )
          }
        </div>
      </div>
    </div>
  );
}

function getCompletionTime(startDate: number, endDate: number): string {
  const diff = Math.abs(endDate - startDate);

  const hours = Math.floor(diff / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);

  if (hours === 0) {
    return `${minutes} minutes`;
  }
  return `${hours} hours, ${minutes} minutes`;
}
