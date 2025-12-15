import CustomThrowError from "../helpers/custom.throw.error.js";
import Maintenance from "../models/maintenance.model.js";
import Tire from "../models/tire.model.js";

class VehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async _getThresholds(vehicleType) {
    const doc = await Maintenance.findOne().lean();
    const defaults = { oilChange: 10000, tireChange: 5000, truckMaintenance: 2000 };
    if (!doc || !Array.isArray(doc.rules)) return defaults;
    const map = { ...defaults };
    for (const r of doc.rules) {
      if (!r || !r.key) continue;
      if (r.role === 'All' || r.role === vehicleType) {
        map[r.key] = Number(r.km || map[r.key]);
      }
    }
    return map;
  }

  async _computeFlagsForVehicle(v) {
    if (!v) return null;
    const vehicle = v.toObject ? v.toObject() : v;
    const vehicleType = vehicle.vehicleType || 'Truck';
    const thresholds = await this._getThresholds(vehicleType);
    const totalMileage = Number(vehicle.totalMileage || 0);
    const lastOil = Number(vehicle.lastOilChangeMileage || 0);

    const oilDue = lastOil >= (thresholds.oilChange || 10000);

    const tires = await Tire.find({ installedOn: vehicle._id }).lean();
    const tireDue = tires.some(t => Number(t.usedMileage || 0) >= (thresholds.tireChange || 5000));

    const maintenanceDue = totalMileage >= (thresholds.truckMaintenance || 2000);

    return { ...vehicle, oilDue, tireDue, maintenanceDue };
  }

  async createVehicle(data) {
    const exists = await this.vehicleRepository.findByPlateNumber(data.plateNumber);
    if (exists) throw CustomThrowError('plateNumber', 'Plate number already exists', 409);
    const v = await this.vehicleRepository.create(data);
    return this._computeFlagsForVehicle(v);
  }

  async getAllVehicles() {
    const list = await this.vehicleRepository.findAll();
    
    const out = await Promise.all(
        list.map(v => this._computeFlagsForVehicle(v))
    );
    
    return out;
  }

  async getVehicleById(id) {
    const v = await this.vehicleRepository.findById(id);
    return this._computeFlagsForVehicle(v);
  }

  async getVehicleByDriver(driverId) {
    const v = await this.vehicleRepository.findByDriver(driverId);
    return this._computeFlagsForVehicle(v);
  }

  async updateVehicle(id, data) {
    const v = await this.vehicleRepository.update(id, data);
    return this._computeFlagsForVehicle(v);
  }

  async deleteVehicle(id) {
    return this.vehicleRepository.delete(id);
  }
}

export default VehicleService;
