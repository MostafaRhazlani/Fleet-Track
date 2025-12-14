import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTrips } from '../../store/trip/tripSlice';
import TripCard from '../../components/trip/TripCard';

const MyTrips = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { mytrips } = useSelector((s) => s.trips);

  useEffect(() => {
    dispatch(fetchMyTrips());
  }, [dispatch]);

  const myTrips = mytrips || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Trips</h2>
      </div>

      {myTrips.length === 0 ? (
        <div className="text-sm text-gray-500">No trips assigned to you.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTrips.map((t) => (
            <TripCard key={t._id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
