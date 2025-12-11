class VehicleController {
  constructor(vehicleService) {
    this.vehicleService = vehicleService;
  }

  async create(req, res) {
    try {
      const vehicle = await this.vehicleService.createVehicle(req.body);
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

  async update(req, res) {
    try {
      const vehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
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
