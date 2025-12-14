import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { formatDateTime } from '../../tools/date';
import { updateTripStatus } from '../../store/trip/tripSlice';

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'started', label: 'Started' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'completed', label: 'Completed' },
];

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const TripCard = ({ trip, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const start = trip.startDate ? formatDateTime(trip.startDate) : '—';
  const end = trip.endDate ? formatDateTime(trip.endDate) : '—';

  const [localStatus, setLocalStatus] = useState(trip.status || 'planned');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setLocalStatus(trip.status || 'planned');
  }, [trip.status]);

  // determine if current user is the trip's driver
  const driverId = trip.driver && typeof trip.driver === 'object' ? (trip.driver._id || trip.driver.id) : trip.driver;
  const isDriverOwner = user && user.role === 'Driver' && (user._id === driverId || user.id === driverId);

  const statusLabel = localStatus ? (localStatus.charAt(0).toUpperCase() + localStatus.slice(1)) : '—';
  const statusClass = (
    {
      planned: 'bg-gray-100 text-gray-800',
      started: 'bg-blue-100 text-blue-800',
      stopped: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    }[localStatus] || 'bg-gray-100 text-gray-800'
  );

  // close menu on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handleStatusClick = () => {
    if (isDriverOwner) setMenuOpen((s) => !s);
  };

  const handleChangeStatus = async (value) => {
    if (value === localStatus) {
      setMenuOpen(false);
      return;
    }
    try {
      // optimistically update
      setLocalStatus(value);
      await dispatch(updateTripStatus({ id: trip._id, status: value })).unwrap();
    } catch (err) {
      // rollback on error
      setLocalStatus(trip.status || 'planned');
      console.error('Failed to update trip status', err);
    } finally {
      setMenuOpen(false);
    }
  };

  const showActions = !(isDriverOwner);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{trip.from} → {trip.to}</h3>
          <p className="text-sm text-gray-500">Driver: {trip.driver?.first_name ? `${trip.driver.first_name} ${trip.driver.last_name}` : trip.driver || '—'}</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={handleStatusClick} className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${statusClass}`}>{statusLabel}</button>
          {menuOpen && (
            <ul
              className="absolute z-10 right-0 mt-2 w-40 bg-white max-h-60 rounded-md py-1 text-base ring-1 ring-primary/20 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              role="listbox"
            >
              {statusOptions.map((option) => (
                <li
                  key={option.value}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary/5 transition-colors ${localStatus === option.value ? 'bg-primary/5 text-primary' : 'text-gray-900'
                    }`}
                  onClick={() => handleChangeStatus(option.value)}
                  role="option"
                >
                  <span className={`block truncate ${localStatus === option.value ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>

                  {localStatus === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-gray-100" />

      <div className="text-xs text-gray-500 mb-4">
        <div className="flex justify-between"><span>Start</span><span>{start}</span></div>
        <div className="flex justify-between"><span>End</span><span>{end}</span></div>
      </div>

      {showActions && (
        <div className="mt-auto flex gap-2">
          <button onClick={() => onEdit?.(trip)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Edit</button>
          <button onClick={() => onDelete?.(trip)} className="flex-1 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
        </div>
      )}
    </div>
  );
};

export default TripCard;
