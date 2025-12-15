import { useEffect, useState } from 'react';
import api from '../../tools/axios';
import TripsRow from '../../components/dashboard/TripsRow';
import StatCard from '../../components/dashboard/StatCard';

const DriverDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/driver');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Mileage" total={`${data.totalMileage} km`} bg="bg-[#FFF6E9]" />
        <StatCard title="Last Oil Change" total={`${data.lastOilChange} km`} bg="bg-[#ECF7E9]" />
        <StatCard title="Fuel Consumed" total={`${data.fuelConsumed} km`} bg="bg-[#E9F0FF]" />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-end">
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-row justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Last 5 Trips</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-100">
                  <th className="pb-4 font-medium pl-2">Trip</th>
                  <th className="pb-4 font-medium">Driver</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.lastFiveTrips.map((t) => (
                  <TripsRow key={t._id} trip={t} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DriverDashboard;
