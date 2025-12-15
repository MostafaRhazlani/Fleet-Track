import { beforeEach, describe, expect, jest } from "@jest/globals"

const { default: DashboardService } = await import('../src/services/dashboard.service.js');

describe('DashboardService', () => {
    let dashboardService;
    let mockVehicleRepo;
    let mockTripRepo;
    let mockTireRepo;

    beforeEach(() => {
        mockVehicleRepo = { findAll: jest.fn(), findByDriver: jest.fn() };
        mockTripRepo = { findAll: jest.fn(), findByDriver: jest.fn() };
        mockTireRepo = { findAll: jest.fn() };

        dashboardService = new DashboardService(mockVehicleRepo, mockTripRepo, mockTireRepo);
    });

    it('computes admin dashboard aggregates', async () => {
        const vehicles = [
            { totalFuelConsumed: '10', vehicleType: 'Truck' },
            { totalFuelConsumed: 5, vehicleType: 'Trailer' },
        ];
        const tires = [{}, {}];
        const trips = [
            { createdAt: '2020-01-01' },
            { createdAt: '2021-01-01' },
            { createdAt: '2019-01-01' },
        ];

        mockVehicleRepo.findAll.mockResolvedValue(vehicles);
        mockTireRepo.findAll.mockResolvedValue(tires);
        mockTripRepo.findAll.mockResolvedValue(trips);

        const res = await dashboardService.adminDashboard();
        expect(res.totalFuelConsumed).toBe(15);
        expect(res.totalTrucks).toBe(1);
        expect(res.totalTrailers).toBe(1);
        expect(res.totalTires).toBe(2);
        expect(res.lastFiveTrips.length).toBeGreaterThan(0);
    });

    it('computes driver dashboard', async () => {
        const vehicle = { totalMileage: 1000, lastOilChangeMileage: 200, totalFuelConsumed: 50 };
        const trips = [ { createdAt: '2021-05-01' }, { createdAt: '2021-04-01' } ];

        mockVehicleRepo.findByDriver.mockResolvedValue(vehicle);
        mockTripRepo.findByDriver.mockResolvedValue(trips);

        const res = await dashboardService.driverDashboard('driver1');
        expect(res.vehicle).toEqual(vehicle);
        expect(res.totalMileage).toBe(1000);
        expect(res.lastOilChange).toBe(200);
        expect(res.fuelConsumed).toBe(50);
        expect(res.lastFiveTrips.length).toBe(2);
    });
});
