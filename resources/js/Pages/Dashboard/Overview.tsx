import AdminLayout from '@/Layouts/AdminLayout'

export default function Overview() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome to your Bubbly Pups admin dashboard. Use the sidebar to navigate.</p>
      </div>
    </AdminLayout>
  )
}
