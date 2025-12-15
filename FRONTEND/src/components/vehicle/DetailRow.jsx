const DetailRow = ({ icon, label, value, highlight = false, danger = false }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${danger ? 'bg-red-100 text-red-600' : highlight ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
      <p className={`font-semibold ${danger ? 'text-red-600' : highlight ? 'text-orange-600' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);

export default DetailRow;
