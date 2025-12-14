import CustomThrowError from "../helpers/custom.throw.error.js";

class TireService {
  constructor(tireRepository) {
    this.tireRepository = tireRepository;
  }

  async createTire(data) {
    const exists = await this.tireRepository.findBySerial(data.serialNumber);
    if (exists) throw CustomThrowError('serialNumber', 'Serial number already exists', 409);
    return this.tireRepository.create(data);
  }

  async getAllTires() {
    return this.tireRepository.findAll();
  }

  async getTireById(id) {
    return this.tireRepository.findById(id);
  }

  async updateTire(id, data) {
    return this.tireRepository.update(id, data);
  }

  async deleteTire(id) {
    return this.tireRepository.delete(id);
  }
}

export default TireService;
