import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  role: { type: String, enum: ['Truck', 'Trailer', 'All'], default: 'All' },
  description: { type: String, default: '' },
  km: { type: Number, required: true }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
