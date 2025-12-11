import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  brand: { type: String,  required: true },
  model: { type: String,  required: true },
  maxLoad: { type: String,  required: true },
  
  vehicleType: { type: String, enum: ['Truck', 'Trailer'], required: true },

  currentMileage: { type: Number, default: 0 },
  status: {  type: String,  enum: ['Available', 'In-transit', 'Maintenance', 'Out-service'],  default: 'Available' },
  
  // Maintenance Tracking
  lastOilChangeMileage: { type: Number },
  nextServiceDate: { type: Date },
  
  // Relational Driver
  currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;