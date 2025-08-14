import AdminLayout from '@/Layouts/AdminLayout'

const sampleBookings = [
  { id: 1, dog: 'Max', breed: 'Golden Retriever', owner: 'John Smith', date: '2025-08-15', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, dog: 'Bella', breed: 'Poodle', owner: 'Sarah Johnson', date: '2025-08-16', time: '2:30 PM', status: 'Pending' },
]

export default function Bookings() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Bookings</h1>
      <div className="bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-white/10 rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-white/10">
          {sampleBookings.map((b) => (
            <li key={b.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{b.dog} <span className="text-sm text-gray-500">({b.breed})</span></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Owner: {b.owner}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Appointment: {b.date} at {b.time}</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                  {b.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  )
}
