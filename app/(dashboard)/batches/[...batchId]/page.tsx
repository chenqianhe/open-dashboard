export const runtime = "edge";

interface BatchPageProps {
  params: {
    batchId: string[]
  }
}

export default function BatchPage({ params }: BatchPageProps) {
  const batchId = params.batchId[0]

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm text-muted-foreground">BATCH</h2>
          <h1 className="text-2xl font-semibold mt-1">{batchId}</h1>
        </div>

        {/* Status section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-muted-foreground">Status</h3>
              {/* Status badge will go here */}
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Created at</h3>
              {/* Created at timestamp will go here */}
            </div>
            {/* Other details will be added here */}
          </div>
        </div>

        {/* Files section */}
        <div>
          <h3 className="text-sm text-muted-foreground mb-2">Files</h3>
          {/* Files list will go here */}
        </div>

        {/* Timeline section */}
        <div>
          <h3 className="text-sm text-muted-foreground mb-2">Timeline</h3>
          {/* Timeline will go here */}
        </div>
      </div>
    </div>
  )
}
