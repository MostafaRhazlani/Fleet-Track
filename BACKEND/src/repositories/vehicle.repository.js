import Vehicle from '../models/vehicle.model.js';

class VehicleRepository {
  async findByPlateNumber(plateNumber) {
    return Vehicle.findOne({ plateNumber }).populate('currentDriver', 'first_name last_name email');
  }

  async create(data) {
    const doc = await Vehicle.create(data);
    return Vehicle.findById(doc._id).populate('currentDriver', 'first_name last_name email');
  }

  async findAll() {
    return Vehicle.find().populate('currentDriver', 'first_name last_name email');
  }

  async findById(id) {
    return Vehicle.findById(id).populate('currentDriver', 'first_name last_name email');
  }

  async findByDriver(driverId) {
    return Vehicle.findOne({ currentDriver: driverId }).populate('currentDriver', 'first_name last_name email');
  }

  async update(id, data) {
    const updated = await Vehicle.findByIdAndUpdate(id, data, { new: true });
    return Vehicle.findById(updated._id).populate('currentDriver', 'first_name last_name email');
  }

  async delete(id) {
    return Vehicle.findByIdAndDelete(id);
  }
}

export default VehicleRepository;
