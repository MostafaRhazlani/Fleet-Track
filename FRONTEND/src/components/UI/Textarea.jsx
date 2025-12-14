const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
}) => {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-500  mb-1 ml-1">{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`px-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 border-primary/20 focus:ring-primary ${className}`}
      />
    </div>
  );
};

export default Textarea;
