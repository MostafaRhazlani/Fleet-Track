const Input = ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    onBlur, 
    placeholder, 
    error, 
    icon: Icon,
    onIconClick
}) => {

    // Dynamic classes based on error state
    const baseBorderClass = "w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all";
    const normalClass = "border-indigo-500/20 text-gray-900 focus:ring-indigo-500 focus:border-transparent";
    const errorClass = "border-red-500 text-red-900 focus:ring-red-500 bg-red-50";

    return (
        <div className="group">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`${baseBorderClass} ${error ? errorClass : normalClass}`}
                    autoComplete="true"
                />
                
                {/* Logic to render Icon: either as a Button (for passwords) or a Static Icon */}
                {Icon && (
                    onIconClick ? (
                        <button
                            type="button"
                            onClick={onIconClick}
                            className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ) : (
                        <Icon className={`w-5 h-5 absolute right-4 top-3.5 transition-opacity ${error ? 'text-red-400' : 'text-gray-400 opacity-0 group-hover:opacity-50'}`} />
                    )
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};

export default Input;