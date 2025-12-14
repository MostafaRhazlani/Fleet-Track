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

  async getByDriver(req, res) {
    try {
      const driverId = req.user && req.user.id;
      if (!driverId) return res.status(400).json({ status: 'error', message: 'Driver id missing' });
      const trips = await this.tripService.getTripsByDriver(driverId);
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

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const allowed = ['planned', 'started', 'stopped', 'completed'];
      if (!status || !allowed.includes(status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status' });
      }

      const tripId = req.params.id;
      const existing = await this.tripService.getTripById(tripId);
      if (!existing) return res.status(404).json({ status: 'error', message: 'Trip not found' });

      const trip = await this.tripService.updateTrip(tripId, { status });
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

  async generatePdf(req, res) {
    try {
      const tripId = req.params.id;
      const trip = await this.tripService.getTripById(tripId);
      if (!trip) return res.status(404).json({ status: 'error', message: 'Trip not found' });

      const buffer = await this.tripService.generateTripPdf(trip);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="trip-${tripId}.pdf"`);
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default TripController;
