const StatCard = ({ title, total, bg = 'bg-white' }) => {
  return (
    <div className={`${bg} p-6 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between h-48 transition-transform hover:scale-[1.02] duration-300`}>
      <div className="flex justify-between items-start">
        <span className="text-slate-700 font-medium text-lg">{title}</span>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-slate-800 mb-2">{total}</h3>
      </div>
    </div>
  );
};

export default StatCard;
