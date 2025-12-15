class VehicleController {
  constructor(vehicleService) {
    this.vehicleService = vehicleService;
  }

  async create(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        // store relative path that frontend can use (served at /uploads)
        data.image = `/uploads/${req.file.filename}`;
      }
      const vehicle = await this.vehicleService.createVehicle(data);
      res.status(201).json({ status: 'success', vehicle });
    } catch (error) {
        const statucCode = error.statucCode || 500;
        return res.status(statucCode).json({ 
            status: "error", 
            errors: {
                [error.field] : error.message
            } 
        });
    }
  }

  async getAll(req, res) {
    try {
      const vehicles = await this.vehicleService.getAllVehicles();
      res.status(200).json({ status: 'success', vehicles });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const vehicle = await this.vehicleService.getVehicleById(req.params.id);
      if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
      res.status(200).json({ status: 'success', vehicle });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getMyVehicle(req, res) {
    try {
      const driverId = req.user && req.user._id ? req.user._id : req.user.id;
      const vehicle = await this.vehicleService.getVehicleByDriver(driverId);
      if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found for this driver' });
      res.status(200).json({ status: 'success', vehicle });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updateMyVehicle(req, res) {
    try {
      const driverId = req.user && req.user._id ? req.user._id : req.user.id;
      const vehicle = await this.vehicleService.getVehicleByDriver(driverId);
      if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found for this driver' });

      // Only allow updating mileage and last oil change from this endpoint
      const updateData = {};
      // accept both legacy `currentMileage` and new `totalMileage`
      if (req.body.totalMileage !== undefined) updateData.totalMileage = req.body.totalMileage;
      else if (req.body.currentMileage !== undefined) updateData.totalMileage = req.body.currentMileage;

      if (req.body.lastTripDistance !== undefined) updateData.lastTripDistance = req.body.lastTripDistance;
      if (req.body.totalFuelConsumed !== undefined) updateData.totalFuelConsumed = req.body.totalFuelConsumed;
      if (req.body.lastFuelAdded !== undefined) updateData.lastFuelAdded = req.body.lastFuelAdded;
      if (req.body.lastOilChangeMileage !== undefined) updateData.lastOilChangeMileage = req.body.lastOilChangeMileage;

      const updated = await this.vehicleService.updateVehicle(vehicle._id, updateData);
      res.status(200).json({ status: 'success', vehicle: updated });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }
      const vehicle = await this.vehicleService.updateVehicle(req.params.id, data);
      if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
      res.status(200).json({ status: 'success', vehicle });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const vehicle = await this.vehicleService.deleteVehicle(req.params.id);
      if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
      res.status(200).json({ status: 'success', message: 'Vehicle deleted' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export default VehicleController;
