export default function ApprovalsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Approvals
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage workflow approvals and pending requests
        </p>
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4 text-left">
            <h3 className="font-semibold">No approvals pending</h3>
            <p className="text-sm text-gray-600">Approval requests will appear here when workflows require them.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
