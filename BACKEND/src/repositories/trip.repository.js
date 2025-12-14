import Trip from '../models/trip.model.js';

class TripRepository {
  async create(data) {
    const created = await Trip.create(data);
    return Trip.findById(created._id).populate('driver');
  }

  async findAll() {
    return Trip.find().populate('driver');
  }

  async findById(id) {
    return Trip.findById(id).populate('driver');
  }

  async update(id, data) {
    return Trip.findByIdAndUpdate(id, data, { new: true }).populate('driver');
  }

  async delete(id) {
    return Trip.findByIdAndDelete(id);
  }
}

export default TripRepository;
