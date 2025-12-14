class TripService {
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  async createTrip(data) {
    return this.tripRepository.create(data);
  }

  async getAllTrips() {
    return this.tripRepository.findAll();
  }

  async getTripsByDriver(driverId) {
    return this.tripRepository.findByDriver(driverId);
  }

  async getTripById(id) {
    return this.tripRepository.findById(id);
  }

  async updateTrip(id, data) {
    return this.tripRepository.update(id, data);
  }

  async deleteTrip(id) {
    return this.tripRepository.delete(id);
  }
}

export default TripService;
