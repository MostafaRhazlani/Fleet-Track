import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import VehicleCard from '../../components/vehicle/VehicleCard';
import VehicleModal from '../../components/vehicle/VehicleModal';
import { fetchVehicles, createVehicle, deleteVehicle, updateVehicle } from '../../store/vehicle/vehicleSlice';
import { setModalOpen, setModalMode } from '../../store/ui/modalSlice';
import { useState } from 'react';

const Vehicles = () => {
	const dispatch = useDispatch();
	const { vehicles } = useSelector((state) => state.vehicles);
	const { modalOpen, modalMode } = useSelector((state) => state.modal);

	useEffect(() => {
        dispatch(fetchVehicles());
	}, [dispatch]);

	const [editingVehicle, setEditingVehicle] = useState(null);

	const handleDelete = async (vehicle) => {
		try {
			dispatch(deleteVehicle(vehicle._id));
		} catch (err) {
			console.error(err);
			alert('Failed to delete vehicle');
		}
	};

	const handleEdit = (vehicle) => {
		setEditingVehicle(vehicle);
		dispatch(setModalMode('edit'));
		dispatch(setModalOpen(true));
	};

	const handleSubmit = async (formData) => {
		try {
			if (modalMode === 'edit' && editingVehicle) {
				await dispatch(updateVehicle({ id: editingVehicle._id, formData })).unwrap();
				setEditingVehicle(null);
			} else {
				await dispatch(createVehicle(formData)).unwrap();
			}
			dispatch(setModalOpen(false));
		} catch (err) {
			console.error(err);
			alert('Failed to save vehicle');
		}
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">Vehicles</h2>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
				{
					vehicles?.map((vehicle, index) => {
						return (
							<VehicleCard
								key={vehicle._id || index}
								vehicle={vehicle}
								onDelete={handleDelete}
								onEdit={handleEdit}
							/>
						)
					})
				}
			</div>

			<VehicleModal
				open={modalOpen}
				onClose={() => dispatch(setModalOpen(false))}
				mode={modalMode}
				initialData={editingVehicle}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}

export default Vehicles