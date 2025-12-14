class TireController {
  constructor(tireService) {
    this.tireService = tireService;
  }

  async create(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const tire = await this.tireService.createTire(data);
      res.status(201).json({ status: 'success', tire });
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
      const tires = await this.tireService.getAllTires();
      res.status(200).json({ status: 'success', tires });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const tire = await this.tireService.getTireById(req.params.id);
      if (!tire) return res.status(404).json({ status: 'error', message: 'Tire not found' });
      res.status(200).json({ status: 'success', tire });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const tire = await this.tireService.updateTire(req.params.id, data);
      if (!tire) return res.status(404).json({ status: 'error', message: 'Tire not found' });
      res.status(200).json({ status: 'success', tire });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const tire = await this.tireService.deleteTire(req.params.id);
      if (!tire) return res.status(404).json({ status: 'error', message: 'Tire not found' });
      res.status(200).json({ status: 'success', message: 'Tire deleted' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export default TireController;
