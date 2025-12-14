import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripCard from '../../components/trip/TripCard';
import TripModal from '../../components/trip/TripModal';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../../store/trip/tripSlice';
import { setModalOpen, setModalMode } from '../../store/ui/modalSlice';

const Trips = () => {
  const dispatch = useDispatch();
  const { trips } = useSelector(state => state.trips);
  const { modalOpen, modalMode } = useSelector(state => state.modal);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const [editing, setEditing] = useState(null);

  const handleEdit = (t) => {
    setEditing(t);
    dispatch(setModalMode('edit'));
    dispatch(setModalOpen(true));
  };

  const handleDelete = (t) => {
    dispatch(deleteTrip(t._id));
  };

  const handleSubmit = async (formData) => {
    if (modalMode === 'edit' && editing) {
      await dispatch(updateTrip({ id: editing._id, formData })).unwrap();
      setEditing(null);
    } else {
      await dispatch(createTrip(formData)).unwrap();
    }
    dispatch(setModalOpen(false));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Trips</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {trips?.map((t) => (
          <TripCard key={t._id} trip={t} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      <TripModal open={modalOpen} onClose={() => dispatch(setModalOpen(false))} mode={modalMode} initialData={editing} onSubmit={handleSubmit} />
    </div>
  );
};

export default Trips;
