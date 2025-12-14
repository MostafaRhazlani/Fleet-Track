import { useState, useEffect } from 'react';
import { X, UploadCloud, } from 'lucide-react';
import Input from '../UI/Input';
import PrimaryButton from '../UI/PrimaryButton';
import CustomSelect from '../UI/CustomSelect';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers } from '../../store/user/userSlice';
import api from '../../tools/axios';
import { setModalOpen } from '../../store/ui/modalSlice';

const VehicleModal = ({ open, onClose, mode = 'add', initialData = null, onSubmit }) => {
    const dispatch = useDispatch();

    const uiModalOpen = useSelector((state) => state.modal?.modalOpen);
    const vehicleTypeOptions = [
        { value: 'Truck', label: 'Truck' },
        { value: 'Trailer', label: 'Trailer' },
    ];

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plateNumber: '',
        assignedDriver: null,
        vehicleType: { value: 'Truck', label: 'Truck' },
        maxLoad: 0,
        nextServiceDate: '',
        currentMileage: '',
        lastOilChangeMileage: '',
        status: 'Available',
        image: '',
    });

    const driversState = useSelector((state) => state.users?.drivers || []);
    const driversOptions = driversState.map(d => ({ value: d._id, label: `${d.first_name} ${d.last_name}` }));

    useEffect(() => {
        if (mode === 'edit') {
            // fetch drivers for assignment selection
            dispatch(fetchDrivers());
        }
    }, [mode, dispatch]);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            // determine assigned driver option if available
            let assignedDriverOpt = null;
            if (initialData.currentDriver) {
                if (typeof initialData.currentDriver === 'object') {
                    const u = initialData.currentDriver;
                    assignedDriverOpt = { value: u._id || u.id, label: `${u.first_name || ''} ${u.last_name || ''}`.trim() };
                } else if (typeof initialData.currentDriver === 'string') {
                    const found = driversState.find(d => d._id === initialData.currentDriver);
                    if (found) assignedDriverOpt = { value: found._id, label: `${found.first_name} ${found.last_name}` };
                    else assignedDriverOpt = null;
                }
            }

            setFormData({
                brand: initialData.brand || '',
                model: initialData.model || '',
                plateNumber: initialData.plateNumber || '',
                assignedDriver: assignedDriverOpt,
                vehicleType: initialData.vehicleType ? { value: initialData.vehicleType, label: initialData.vehicleType } : { value: 'Truck', label: 'Truck' },
                maxLoad: initialData.maxLoad || 0,
                nextServiceDate: initialData.nextServiceDate ? initialData.nextServiceDate.split('T')[0] : '',
                currentMileage: initialData.currentMileage ?? '',
                lastOilChangeMileage: initialData.lastOilChangeMileage ?? '',
                status: initialData.status || 'Available',
                image: initialData.image ? (initialData.image.startsWith('/') ? api.defaults.baseURL.replace('/api/v1', '') + initialData.image : initialData.image) : '',
            });
        }
    }, [mode, initialData, driversState]);

    useEffect(() => {
        if (!uiModalOpen) {
            // reset form when modal closed
            setFormData({
                brand: '',
                model: '',
                plateNumber: '',
                assignedDriver: null,
                vehicleType: { value: 'Truck', label: 'Truck' },
                maxLoad: 0,
                nextServiceDate: '',
                currentMileage: '',
                lastOilChangeMileage: '',
                status: 'Available',
                image: '',
            });
        }
    }, [uiModalOpen]);

    const modalOpen = typeof open === 'boolean' ? open : uiModalOpen;
    const closeModal = onClose ? onClose : () => dispatch(setModalOpen(false));

    if (!modalOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const num = value === '' ? '' : Number(value);
        setFormData(prev => ({ ...prev, [name]: num }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, image: url, imageFile: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('brand', formData.brand || '');
        fd.append('model', formData.model || '');
        fd.append('plateNumber', formData.plateNumber || '');
        fd.append('maxLoad', formData.maxLoad || '');
        if (formData.nextServiceDate) fd.append('nextServiceDate', formData.nextServiceDate);

        if (formData.vehicleType?.value) fd.append('vehicleType', formData.vehicleType.value);

        // append edit-only maintenance and assignment fields
        if (mode === 'edit') {
            if (formData.currentMileage !== undefined && formData.currentMileage !== '') fd.append('currentMileage', formData.currentMileage);
            if (formData.lastOilChangeMileage !== undefined && formData.lastOilChangeMileage !== '') fd.append('lastOilChangeMileage', formData.lastOilChangeMileage);
            if (formData.status) fd.append('status', formData.status);
            if (formData.assignedDriver?.value) fd.append('currentDriver', formData.assignedDriver.value);
        }

        if (formData.imageFile) fd.append('image', formData.imageFile);
        
        try {
            if (onSubmit) {
                await onSubmit(fd); 
            }
            closeModal();
        } catch (error) {
            console.error("Submission failed, keeping modal open:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            />

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                encType='multipart/form-data'
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit Vehicle' : 'Add Vehicle'}</h2>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-50 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Vehicle Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g. Renault"
                                className="w-full"
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="e.g. Kangoo Express"
                                className="w-full"
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Plate Number"
                                name="plateNumber"
                                value={formData.plateNumber}
                                onChange={handleChange}
                                placeholder="e.g. 12345-A-6"
                                className="w-full"
                                disabled={mode === 'view'}
                            />
                            
                            {mode === 'view' ? (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Assigned Driver</label>
                                    <div className="px-4 py-2 rounded-xl border bg-gray-50 text-gray-700">{formData.assignedDriver?.label || 'Unassigned'}</div>
                                </div>
                            ) : (
                                <>
                                    <CustomSelect 
                                        label="Vehicle Type"
                                        placeholder={"Select Vehicle Type"}
                                        className="w-full"
                                        options={vehicleTypeOptions}
                                        value={formData.vehicleType}
                                        onChange={(opt) => setFormData(prev => ({ ...prev, vehicleType: opt }))}
                                    />

                                    {mode === 'edit' && (
                                        <CustomSelect
                                            label="Assigned Driver"
                                            placeholder={"Select Driver"}
                                            className="w-full"
                                            options={driversOptions}
                                            value={formData.assignedDriver}
                                            onChange={(opt) => setFormData(prev => ({ ...prev, assignedDriver: opt }))}
                                        />
                                    )}
                                </>
                            )}

                            <Input
                                label="Max Load"
                                name="maxLoad"
                                type="number"
                                value={formData.maxLoad}
                                onChange={handleNumberChange}
                                placeholder="e.g. 1,500 kg"
                                className="w-full"
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Next Service Date"
                                type="date"
                                name="nextServiceDate"
                                value={formData.nextServiceDate}
                                onChange={handleChange}
                                className="w-full"
                                disabled={mode === 'view'}
                            />

                            {mode === 'edit' && (
                                <>
                                    <Input
                                        label="Current Mileage"
                                        name="currentMileage"
                                        type="number"
                                        value={formData.currentMileage}
                                        onChange={handleNumberChange}
                                        className="w-full"
                                    />

                                    <Input
                                        label="Last Oil Change Mileage"
                                        name="lastOilChangeMileage"
                                        type="number"
                                        value={formData.lastOilChangeMileage}
                                        onChange={handleNumberChange}
                                        className="w-full"
                                    />

                                    <CustomSelect
                                        label="Status"
                                        placeholder="Select status"
                                        className="w-full"
                                        options={[
                                            { value: 'Available', label: 'Available' },
                                            { value: 'In-transit', label: 'In-transit' },
                                            { value: 'Maintenance', label: 'Maintenance' },
                                            { value: 'Out-service', label: 'Out-service' },
                                        ]}
                                        value={formData.status ? { value: formData.status, label: formData.status } : null}
                                        onChange={(opt) => setFormData(prev => ({ ...prev, status: opt?.value }))}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div>
                        <h3 className="block text-xs font-medium text-gray-500 mb-1 ml-1">Vehicle Image</h3>

                        <label className="block">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={mode === 'view'} />
                            <div className={`border-2 border-dashed border-gray-200 rounded-xl p-8 transition-colors hover:border-primary hover:bg-primary/5 group ${mode === 'view' ? '' : 'cursor-pointer'} relative overflow-hidden`}>
                                {formData.image ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                            <img
                                                src={formData.image}
                                                alt="Vehicle Preview"
                                                className="w-full h-full object-contain bg-gray-50"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">Click to replace image</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 transition-transform">
                                            <UploadCloud size={24} />
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                            Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
                                        </h4>
                                        <p className="text-xs text-gray-400 mb-4">
                                            SVG, PNG, JPG or GIF (max. 800x400px)
                                        </p>
                                        {mode === 'view' ? (
                                            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-lg inline-block">No image</div>
                                        ) : (
                                            <div className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary_hover inline-block">Browse files</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end rounded-b-2xl">    
                            <PrimaryButton title={mode === 'edit' ? 'Update Vehicle' : 'Add Vehicle'} type="submit" />
                </div>
            </form>
        </div>
    );
};

export default VehicleModal;