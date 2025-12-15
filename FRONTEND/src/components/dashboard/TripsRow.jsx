import React from 'react';
import { formatDate } from '../../tools/date';

const TripsRow = ({ trip }) => {
  const driverName = trip.driver ? `${trip.driver.first_name || ''} ${trip.driver.last_name || ''}`.trim() : '—';
  const date = formatDate(trip.createdAt || trip.startDate, 'DD MMM, YYYY') || '—';
  const statusColor = trip.status === 'Completed' ? 'bg-[#E7F8F0] text-[#0F9D58]' : 'bg-[#FEF6E6] text-[#B5850B]';

  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="py-4 pl-2">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{trip._id?.toString().toUpperCase()}</span>
          <span className="text-xs text-slate-500">{trip.from} → {trip.to}</span>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{driverName}</span>
          <span className="text-xs text-slate-500">{trip.driver?.email || ''}</span>
        </div>
      </td>
      <td className="py-4">
        <span className={`${statusColor} px-3 py-1 rounded-full text-xs font-bold`}>{trip.status}</span>
      </td>
      <td className="py-4 text-slate-500 font-medium text-sm">{date}</td>
    </tr>
  );
};

export default TripsRow;
