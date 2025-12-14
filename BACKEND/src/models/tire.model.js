import mongoose from "mongoose";

const tireSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: String, required: true },
  position: { type: String, enum: ['front-left', 'front-right', 'rear-left', 'rear-right'] },
  image: { type: String },

  status: { type: String, enum: ['New', 'In-use', 'Maintenance', 'Retired'], default: 'New' },

  // Relationship to vehicle when installed
  installedOn: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

  usedMileage: { type: Number, default: 0 },
}, { timestamps: true });

const Tire = mongoose.model('Tire', tireSchema);

export default Tire;
