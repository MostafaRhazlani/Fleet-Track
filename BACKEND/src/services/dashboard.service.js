class DashboardService {
  constructor(vehicleRepository, tripRepository, tireRepository) {
    this.vehicleRepository = vehicleRepository;
    this.tripRepository = tripRepository;
    this.tireRepository = tireRepository;
  }

  async adminDashboard() {
    const vehicles = await this.vehicleRepository.findAll();
    const tires = await this.tireRepository.findAll();
    const trips = await this.tripRepository.findAll();

    const totalFuelConsumed = vehicles.reduce((s, v) => s + Number(v.totalFuelConsumed || 0), 0);
    const totalTrucks = vehicles.filter(v => v.vehicleType === 'Truck').length;
    const totalTrailers = vehicles.filter(v => v.vehicleType === 'Trailer').length;
    const totalTires = (tires || []).length;

    const lastFiveTrips = (trips || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

    return { totalFuelConsumed, totalTrucks, totalTrailers, totalTires, lastFiveTrips };
  }

  async driverDashboard(driverId) {
    const vehicle = await this.vehicleRepository.findByDriver(driverId);
    const trips = await this.tripRepository.findByDriver(driverId) || [];

    const totalMileage = vehicle ? Number(vehicle.totalMileage || 0) : 0;
    const lastOilChange = vehicle ? Number(vehicle.lastOilChangeMileage || 0) : 0;
    const fuelConsumed = vehicle ? Number(vehicle.totalFuelConsumed || 0) : 0;

    const lastFiveTrips = (trips || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

    return { vehicle, totalMileage, lastOilChange, fuelConsumed, lastFiveTrips };
  }
}

export default DashboardService;
