import AdminLayout from '@/Layouts/AdminLayout'

const sampleDogs = [
  { id: 1, name: 'Max', breed: 'Golden Retriever', owner: 'John Smith', lastVisit: '2025-07-15' },
  { id: 2, name: 'Bella', breed: 'Poodle', owner: 'Sarah Johnson', lastVisit: '2025-07-20' },
]

export default function Dogs() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Doggie Database</h1>
      <div className="bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-white/10 rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-white/10">
          {sampleDogs.map((d) => (
            <li key={d.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{d.name} <span className="text-sm text-gray-500">({d.breed})</span></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Owner: {d.owner}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Last Visit: {d.lastVisit}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  )
}
