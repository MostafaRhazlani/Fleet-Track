import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import TireCard from '../../components/tire/TireCard';
import TireModal from '../../components/tire/TireModal';
import { fetchTires, createTire, deleteTire, updateTire } from '../../store/tire/tireSlice';
import { setModalOpen, setModalMode } from '../../store/ui/modalSlice';

const Tires = () => {
    const dispatch = useDispatch();
    const { tires } = useSelector((state) => state.tires);
    const { modalOpen, modalMode } = useSelector((state) => state.modal);

    useEffect(() => {
        dispatch(fetchTires());
    }, [dispatch]);

    const [editingTire, setEditingTire] = useState(null);

    const handleDelete = async (tire) => {
        try { dispatch(deleteTire(tire._id)); } catch (err) { console.error(err); alert('Failed to delete tire'); }
    };

    const handleEdit = (tire) => {
        setEditingTire(tire);
        dispatch(setModalMode('edit'));
        dispatch(setModalOpen(true));
    };

    const handleSubmit = async (formData) => {
        try {
            if (modalMode === 'edit' && editingTire) {
                await dispatch(updateTire({ id: editingTire._id, formData })).unwrap();
                setEditingTire(null);
            } else {
                await dispatch(createTire(formData)).unwrap();
            }
            dispatch(setModalOpen(false));
        } catch (err) {
            console.error(err);
            alert('Failed to save tire');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tires</h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
                {tires?.map((tire, index) => (
                    <TireCard key={tire._id || index} tire={tire} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
            </div>

            <TireModal open={modalOpen} onClose={() => dispatch(setModalOpen(false))} mode={modalMode} initialData={editingTire} onSubmit={handleSubmit} />
        </div>
    );
};

export default Tires;
