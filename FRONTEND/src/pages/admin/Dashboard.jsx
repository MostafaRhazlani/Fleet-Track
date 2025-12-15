import { useEffect, useState } from 'react';
import api from '../../tools/axios';
import StatCard from '../../components/dashboard/StatCard';
import TripsRow from '../../components/dashboard/TripsRow';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8 font-sans text-slate-800">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Overview</h2>
        <p className="text-gray-500 mb-6">Fleet overview and recent activity</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Fuel" total={`${data.totalFuelConsumed} L`} bg="bg-[#FFF6E9]" />
          <StatCard title="Trucks" total={data.totalTrucks} bg="bg-[#ECF7E9]" />
          <StatCard title="Trailers" total={data.totalTrailers} bg="bg-[#E9F0FF]" />
          <StatCard title="Tires" total={data.totalTires} bg="bg-[#F0F2F5]" />
        </div>
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
    </div>
  );
};

export default Dashboard;