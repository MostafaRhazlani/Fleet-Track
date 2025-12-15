import { useNavigate } from 'react-router';
import api from '../../tools/axios';

const VehicleCard = ({ vehicle, onDelete, onEdit }) => {
    const navigate = useNavigate();

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Image Container */}
            <div className="relative w-full mb-4 h-44 bg-gray-50 overflow-hidden flex items-center justify-center">
                {vehicle.image ? (
                    <img
                        src={vehicle.image.startsWith('/') ? api.defaults.baseURL.replace('/api/v1', '') + vehicle.image : vehicle.image}
                        alt={vehicle.brand}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-gray-300">No image</div>
                )}
            </div>

            <div className="p-4">
                {/* Header Info */}
                <div className="flex justify-between items-start mb-1">
                        <div>
                            <button onClick={() => navigate(`/admin/vehicles/${vehicle._id}`)} className="text-left">
                                <h3 className="text-lg font-semibold text-gray-900 hover:underline">{vehicle.brand}</h3>
                            </button>
                            <p className="text-sm text-gray-500">{vehicle.model}</p>
                        </div>
                    <div>
                        <span className="w-1.5 h-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-full bg-green-500/20 text-green-500">{ vehicle.status }</span>
                    </div>
                </div>

                <div className="h-px w-full bg-gray-100 my-4"></div>

                    <div className="mb-6 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Last check-in/out</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <span className="truncate">{vehicle.lastOilChangeMileage}</span>
                        </span>
                    </div>
                    <div className="hidden sm:block"></div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Max. load capacity</span>
                        <span className="font-semibold text-gray-800">{vehicle.maxLoad}t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Assigned driver</span>
                        <span className="font-semibold text-gray-800">{`${vehicle.currentDriver.first_name} ${vehicle.currentDriver.last_name}`}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button onClick={() => onEdit?.(vehicle)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        Edit
                    </button>
                    <button onClick={() => onDelete?.(vehicle)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
