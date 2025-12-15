const DetailRow = ({ icon, label, value, highlight = false }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${highlight ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-orange-600' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);

export default DetailRow;
