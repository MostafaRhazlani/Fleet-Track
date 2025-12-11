import Vehicle from '../models/vehicle.model.js';

class VehicleRepository {
  async findByPlateNumber(plateNumber) {
    return Vehicle.findOne({ plateNumber });
  }

  async create(data) {
    return Vehicle.create(data);
  }

  async findAll() {
    return Vehicle.find();
  }

  async findById(id) {
    return Vehicle.findById(id);
  }

  async update(id, data) {
    return Vehicle.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Vehicle.findByIdAndDelete(id);
  }
}

export default VehicleRepository;
