export default function WorkflowsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Workflows
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage and monitor your workflows
        </p>
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4 text-left">
            <h3 className="font-semibold">No workflows found</h3>
            <p className="text-sm text-gray-600">Create your first workflow to get started.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
