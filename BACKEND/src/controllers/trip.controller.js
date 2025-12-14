class TripController {
  constructor(tripService) {
    this.tripService = tripService;
  }

  async create(req, res) {
    try {
      const data = { ...req.body };
      const trip = await this.tripService.createTrip(data);
      res.status(201).json({ status: 'success', trip });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const trips = await this.tripService.getAllTrips();
      res.status(200).json({ status: 'success', trips });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const trip = await this.tripService.getTripById(req.params.id);
      if (!trip) return res.status(404).json({ status: 'error', message: 'Trip not found' });
      res.status(200).json({ status: 'success', trip });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      const trip = await this.tripService.updateTrip(req.params.id, data);
      if (!trip) return res.status(404).json({ status: 'error', message: 'Trip not found' });
      res.status(200).json({ status: 'success', trip });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const trip = await this.tripService.deleteTrip(req.params.id);
      if (!trip) return res.status(404).json({ status: 'error', message: 'Trip not found' });
      res.status(200).json({ status: 'success', message: 'Trip deleted' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export default TripController;
