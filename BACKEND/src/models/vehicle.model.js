import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String },
  maxLoad: { type: String, required: true },
  
  vehicleType: { type: String, enum: ['Truck', 'Trailer'], required: true },

  totalMileage: { type: Number, default: 0 },
  lastTripDistance: { type: Number, default: 0 },

  totalFuelConsumed: { type: Number, default: 0 }, 
  lastFuelAdded: { type: Number, default: 0 },

  lastOilChangeMileage: { type: Number, default: 0 },
  
  status: { type: String, enum: ['Available', 'In-transit', 'Maintenance', 'Out-service'], default: 'Available' },
  
  currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;