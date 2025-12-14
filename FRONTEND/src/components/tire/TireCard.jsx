import api from '../../tools/axios';

const TireCard = ({ tire, onDelete, onEdit }) => {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="relative w-full mb-4 h-44 bg-gray-50 overflow-hidden flex items-center justify-center">
                {tire.image ? (
                    <img
                        src={tire.image.startsWith('/') ? api.defaults.baseURL.replace('/api/v1', '') + tire.image : tire.image}
                        alt={tire.brand}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-gray-300">No image</div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tire.brand} {tire.model}</h3>
                        <p className="text-sm text-gray-500">SN: {tire.serialNumber}</p>
                    </div>
                    <div>
                        <span className="w-1.5 h-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-full bg-green-500/20 text-green-500">{tire.status}</span>
                    </div>
                </div>

                <div className="h-px w-full bg-gray-100 my-4"></div>

                <div className="mb-6 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Size</span>
                        <span className="font-semibold text-gray-800">{tire.size}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Position</span>
                        <span className="font-semibold text-gray-800">
                            {(() => {
                                const map = {
                                    'front-left': 'Front Left',
                                    'front-right': 'Front Right',
                                    'rear-left': 'Rear Left',
                                    'rear-right': 'Rear Right',
                                };
                                return tire.position ? map[tire.position] || tire.position : '—';
                            })()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 mb-0.5">Installed On</span>
                        <span className="font-semibold text-gray-800">{tire.installedOn ? tire.installedOn.brand || tire.installedOn : 'Uninstalled'}</span>
                    </div>
                </div>

                <div className="mt-auto flex gap-2">
                    <button onClick={() => onEdit?.(tire)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        Edit
                    </button>
                    <button onClick={() => onDelete?.(tire)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TireCard;
