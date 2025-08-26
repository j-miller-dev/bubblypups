import AdminLayout from '@/Layouts/AdminLayout'

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  notes?: string;
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  lastVisit?: string;
  totalBookings: number;
}

interface Props {
  dogs: {
    data: Dog[];
    links: string;
  };
}

export default function Dogs({ dogs }: Props) {
  return (
    <AdminLayout>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Doggie Database</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all dogs in your grooming database including their owner information and visit history.
          </p>
        </div>
      </div>

      <div className="bg-white shadow border border-gray-200 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {dogs.data.map((dog) => (
            <li key={dog.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {dog.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-medium text-gray-900">
                          {dog.name}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {dog.breed}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <span>Age: {dog.age} years</span>
                        <span>•</span>
                        <span>Weight: {dog.weight}kg</span>
                        <span>•</span>
                        <span>{dog.totalBookings} bookings</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-900 font-medium">
                          Owner: {dog.owner.name}
                        </p>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <span>{dog.owner.email}</span>
                          <span>•</span>
                          <span>{dog.owner.phone}</span>
                        </div>
                      </div>
                      {dog.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 italic">
                            "{dog.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  {dog.lastVisit ? (
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Last Visit</p>
                      <p className="text-sm text-gray-500">{dog.lastVisit}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500">No visits yet</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {dogs.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No dogs found in the database.</p>
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: dogs.links }} />
      </div>
    </AdminLayout>
  )
}
