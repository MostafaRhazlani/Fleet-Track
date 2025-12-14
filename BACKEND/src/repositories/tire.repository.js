import Tire from '../models/tire.model.js';

class TireRepository {
  async findBySerial(serialNumber) {
    return Tire.findOne({ serialNumber });
  }

  async create(data) {
    return Tire.create(data);
  }

  async findAll() {
    return Tire.find();
  }

  async findById(id) {
    return Tire.findById(id);
  }

  async update(id, data) {
    return Tire.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Tire.findByIdAndDelete(id);
  }
}

export default TireRepository;
