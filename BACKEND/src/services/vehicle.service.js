import CustomThrowError from "../helpers/custom.throw.error.js";

class VehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async createVehicle(data) {
    const exists = await this.vehicleRepository.findByPlateNumber(data.plateNumber);
    if (exists) throw CustomThrowError('plateNumber', 'Plate number already exists', 409);
    return this.vehicleRepository.create(data);
  }

  async getAllVehicles() {
    return this.vehicleRepository.findAll();
  }

  async getVehicleById(id) {
    return this.vehicleRepository.findById(id);
  }

  async updateVehicle(id, data) {
    return this.vehicleRepository.update(id, data);
  }

  async deleteVehicle(id) {
    return this.vehicleRepository.delete(id);
  }
}

export default VehicleService;
