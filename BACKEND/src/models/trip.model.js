import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },

  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['planned', 'started', 'stopped', 'completed'], default: 'planned' },

  startDate: { type: Date },
  endDate: { type: Date },

  notes: { type: String },
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
