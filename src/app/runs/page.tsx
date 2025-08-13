export default function RunsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Runs
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Monitor workflow runs and execution history
        </p>
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4 text-left">
            <h3 className="font-semibold">No runs found</h3>
            <p className="text-sm text-gray-600">Execute a workflow to see runs here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
