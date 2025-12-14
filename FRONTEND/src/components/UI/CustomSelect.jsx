import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CustomSelect = ({ label, options = [], className, placeholder = "Select an option", onChange, disabled = false, value = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    // 2. Toggle Dropdown
    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    // 3. Handle Selection
    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) onChange(option); // Return value to parent
    };

    // 4. Handle Click Outside (to close dropdown)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync external value -> internal selectedOption
    useEffect(() => {
        if (value) setSelectedOption(value);
    }, [value]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Label */}
            {label && (
                <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                    {label}
                </label>
            )}

            {/* The Trigger Button (Mimics the Select Input) */}
            <button
                type="button"
                onClick={toggleDropdown}
                disabled={disabled}
                className={`relative w-full ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'} border pl-3 px-4 py-2 text-left rounded-xl focus:ring-primary focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 ${className} ${isOpen ? 'ring-primary' : 'border-primary/20'
                    }`}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown 
                        size={22} 
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </span>
            </button>

            {/* The Popup / Dropdown Menu */}
            {isOpen && (
                <ul
                    className="absolute z-10 mt-2 w-full bg-white max-h-60 rounded-md py-1 text-base ring-1 ring-primary/20 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    role="listbox"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary/5 transition-colors ${selectedOption?.value === option.value ? 'bg-primary/5 text-primary' : 'text-gray-900'
                                }`}
                            onClick={() => handleSelect(option)}
                            role="option"
                        >
                            <span className={`block truncate ${selectedOption?.value === option.value ? 'font-semibold' : 'font-normal'}`}>
                                {option.label}
                            </span>

                            {/* Checkmark for selected item */}
                            {selectedOption?.value === option.value && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                    <CheckIcon className="h-5 w-5" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;