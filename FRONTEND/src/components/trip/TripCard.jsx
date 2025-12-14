import api from '../../tools/axios';

const TripCard = ({ trip, onEdit, onDelete }) => {
  const start = trip.startDate ? new Date(trip.startDate).toLocaleString() : '—';
  const end = trip.endDate ? new Date(trip.endDate).toLocaleString() : '—';

  const statusLabel = trip.status ? (trip.status.charAt(0).toUpperCase() + trip.status.slice(1)) : '—';
  const statusClass = (
    {
      planned: 'bg-gray-100 text-gray-800',
      started: 'bg-blue-100 text-blue-800',
      stopped: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    }[trip.status] || 'bg-gray-100 text-gray-800'
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{trip.from} → {trip.to}</h3>
          <p className="text-sm text-gray-500">Driver: {trip.driver?.first_name ? `${trip.driver.first_name} ${trip.driver.last_name}` : trip.driver || '—'}</p>
        </div>
        <div>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>

      <div className="my-4 h-px bg-gray-100" />

      <div className="text-xs text-gray-500 mb-4">
        <div className="flex justify-between"><span>Start</span><span>{start}</span></div>
        <div className="flex justify-between"><span>End</span><span>{end}</span></div>
      </div>

      <div className="mt-auto flex gap-2">
        <button onClick={() => onEdit?.(trip)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Edit</button>
        <button onClick={() => onDelete?.(trip)} className="flex-1 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
};

export default TripCard;
