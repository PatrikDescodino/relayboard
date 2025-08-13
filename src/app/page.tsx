import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Relayboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A powerful workflow management platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <Link href="/workflows" className="block">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Workflows</h3>
              <p className="text-sm text-blue-700">Manage and monitor your workflows</p>
            </div>
          </Link>
          <Link href="/runs" className="block">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Runs</h3>
              <p className="text-sm text-green-700">Monitor workflow runs and execution history</p>
            </div>
          </Link>
          <Link href="/approvals" className="block">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:bg-yellow-100 transition-colors">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">Approvals</h3>
              <p className="text-sm text-yellow-700">Manage workflow approvals and pending requests</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
