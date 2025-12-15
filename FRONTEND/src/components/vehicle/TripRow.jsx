const TripRow = ({ trip, index }) => {
  const status = trip.status ? (trip.status.charAt(0).toUpperCase() + trip.status.slice(1)) : 'Planned';
  const statusStyles = {
    Planned: 'bg-slate-100 text-slate-600',
    Started: 'bg-orange-100 text-orange-700',
    Stopped: 'bg-slate-100 text-slate-600',
    Completed: 'bg-green-100 text-green-700',
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="px-4 py-4 font-semibold text-slate-700 group-hover:text-orange-600">{ index+1 }</td>
      <td className="px-4 py-4 text-slate-600">{trip.from}</td>
      <td className="px-4 py-4 text-slate-600">{trip.to}</td>
      <td className="px-4 py-4 text-slate-500 text-xs font-mono">{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : '—'}</td>
      <td className="px-4 py-4 text-slate-600">{trip.driver?.first_name ? `${trip.driver.first_name} ${trip.driver.last_name}` : '—'}</td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyles[status] || 'bg-gray-100'}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

export default TripRow;
