import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyVehicle, updateMyVehicle } from '../../store/vehicle/vehicleSlice';
import { fetchMyTrips } from '../../store/trip/tripSlice';
import Input from '../../components/UI/Input';
import PrimaryButton from '../../components/UI/PrimaryButton';
import { Truck, Box, MapPin, Clock, Filter, Droplets, Fuel } from 'lucide-react';
import api from '../../tools/axios';
import DetailRow from '../../components/vehicle/DetailRow';
import TripRow from '../../components/vehicle/TripRow';

const StatItem = ({ label, value, sub, subColor }) => (
  <div className="flex flex-col">
    <span className="text-xs text-slate-400">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="font-semibold text-slate-900">{value}</span>
      {sub && <span className={`${subColor || 'text-slate-400'} text-xs font-medium`}>{sub}</span>}
    </div>
  </div>
);

const MyVehicle = () => {
  const dispatch = useDispatch();
  const vehicle = useSelector((s) => s.vehicles?.myVehicle || null);
  const trips = useSelector((s) => s.trips?.mytrips || []);
  const [form, setForm] = useState({ totalMileage: '', lastOilChangeMileage: '', currentMileage: '', currentFuelAdded: '' });

  useEffect(() => {
    dispatch(fetchMyVehicle());
    dispatch(fetchMyTrips());
  }, [dispatch]);

  useEffect(() => {
    if (vehicle) setForm({ totalMileage: vehicle.totalMileage ?? '', lastOilChangeMileage: vehicle.lastOilChangeMileage ?? '', currentMileage: '', currentFuelAdded: '' });
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      const lastTripDistance = Number(vehicle.lastTripDistance ?? 0);
      const currentMileage = form.currentMileage !== undefined && form.currentMileage !== '' ? Number(form.currentMileage) : null;
      if (currentMileage !== null) {
        let totalMileage = currentMileage - lastTripDistance;
        payload.totalMileage += totalMileage;
        payload.lastOilChangeMileage = payload.lastOilChangeMileage + totalMileage
      }

      const currentFuel = form.currentFuelAdded !== undefined && form.currentFuelAdded !== '' ? Number(form.currentFuelAdded) : null;
      if (currentFuel !== null) {
        payload.lastFuelAdded = currentFuel;
        payload.totalFuelConsumed = (Number(vehicle.totalFuelConsumed ?? 0) + currentFuel);
      }

      if (currentMileage !== null) {
        payload.lastTripDistance = currentMileage;
      }
      await dispatch(updateMyVehicle(payload)).unwrap();
      dispatch(fetchMyVehicle());
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  if (!vehicle) return <div className="p-6">No vehicle assigned to you.</div>;

  const truckTitle = `${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || vehicle.plateNumber;

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Stats Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{truckTitle}</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">{vehicle.status || 'Active'}</span>
          </div>
          <p className="text-slate-500 text-sm">Fleet ID: <span className="font-mono text-slate-700">{vehicle.plateNumber}</span></p>
        </div>

          <div className="flex gap-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <StatItem label="Weight" value={`${vehicle.maxLoad || '—'} t`} subColor="text-green-500" />
            <div className="w-px bg-slate-100 h-10 self-center"></div>
            <StatItem label="Last Oil" value={`${vehicle.lastOilChangeMileage ?? 0} km`} />
            <div className="w-px bg-slate-100 h-10 self-center"></div>
            <StatItem label="Last Trip" value={`${vehicle.lastTripDistance ?? 0} km`} />
          </div>
      </div>

      {/* Main Truck Visual Section */}
      <div className="relative w-full h-64 md:h-96 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {vehicle.image ? (
            <img
              src={vehicle.image.startsWith('/') ? api.defaults.baseURL.replace('/api/v1', '') + vehicle.image : vehicle.image}
              alt={truckTitle}
              className="w-full h-full object-contain"
            />
          ) : (
            <img src="https://pngimg.com/d/truck_PNG16262.png" alt="Truck" className="w-full h-full object-contain drop-shadow-2xl" />
          )}
        </div>
        <div className="absolute bottom-10 w-3/4 h-4 bg-black/5 rounded-[100%] blur-xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Operation Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <DetailRow icon={<Truck className="w-4 h-4" />} label="Vehicle ID" value={vehicle.plateNumber} />
              <DetailRow icon={<Clock className="w-4 h-4" />} label="Status" value={trips[0]?.status || '—'} highlight={!!trips[0] && trips[0].status === 'started'} />
              <DetailRow icon={<MapPin className="w-4 h-4" />} label="From" value={trips[0] ? `${trips[0].from}` : '—'} />
              <DetailRow icon={<MapPin className="w-4 h-4" />} label="To" value={trips[0] ? trips[0].to : '—'} />
              <DetailRow icon={<Clock className="w-4 h-4" />} label="Start" value={trips[0]?.startDate ? new Date(trips[0].startDate).toLocaleString() : '—'} />
              <DetailRow icon={<Clock className="w-4 h-4" />} label="End" value={trips[0]?.endDate ? new Date(trips[0].endDate).toLocaleString() : '—'} />
              <DetailRow icon={<Truck className="w-4 h-4" />} label="Total Mileage" value={`${vehicle.totalMileage ?? 0} km`} />
              <DetailRow icon={<Fuel className="w-4 h-4" />} label="Fuel Consumed" value={`${vehicle.totalFuelConsumed ?? 0} L`} />
              <DetailRow icon={<Droplets className="w-4 h-4" />} label="Last Oil Change" value={`${vehicle.lastOilChangeMileage ?? 0} km`} />
              <DetailRow icon={<Fuel className="w-4 h-4" />} label="Last Fuel Added" value={`${vehicle.lastFuelAdded ?? 0} L`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Trips</h3>
              <button className="text-slate-400 hover:text-orange-500 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">From</th>
                    <th className="px-4 py-3 font-medium">To</th>
                    <th className="px-4 py-3 font-medium">Start Date</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.map((t, index) => (
                    <TripRow key={index} trip={t} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-800">Vehicle Update</h3>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Input className="w-full" name="currentMileage" label="Current Mileage" value={form.currentMileage} onChange={handleChange} type="number" />
              <Input className="w-full" name="currentFuelAdded" label="Current Fuel Added (L)" value={form.currentFuelAdded} onChange={handleChange} type="number" />
              <div className="mt-3"><PrimaryButton className="w-full" title="Update" type="submit" /></div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyVehicle;
