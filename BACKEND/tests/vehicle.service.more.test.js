import { beforeEach, describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule('../src/models/maintenance.model.js', () => ({
    default: {
        findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ rules: [{ key: 'oilChange', role: 'Truck', km: 5000 }] }) }),
    }
}));

jest.unstable_mockModule('../src/models/tire.model.js', () => ({
    default: {
        find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([{ usedMileage: 6000 }]) }),
    }
}));

const { default: VehicleService } = await import('../src/services/vehicle.service.js');

describe('VehicleService (thresholds & flags)', () => {
    let vehicleService;
    let mockVehicleRepository;

    beforeEach(() => {
        mockVehicleRepository = {
            findByPlateNumber: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByDriver: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        vehicleService = new VehicleService(mockVehicleRepository);
    });

    it('reads thresholds from maintenance rules and returns overridden oilChange', async () => {
        const thresholds = await vehicleService._getThresholds('Truck');
        expect(thresholds.oilChange).toBe(5000);
        expect(thresholds.tireChange).toBeDefined();
    });

    it('computes flags for a vehicle object', async () => {
        const vehicle = { _id: 'v1', vehicleType: 'Truck', totalMileage: 10000, lastOilChangeMileage: 2000 };
        mockVehicleRepository.create.mockResolvedValue(vehicle);

        const enriched = await vehicleService._computeFlagsForVehicle(vehicle);
        expect(enriched).toHaveProperty('oilDue');
        expect(enriched.oilDue).toBe(false);
        expect(enriched.tireDue).toBe(true);
        expect(enriched.maintenanceDue).toBe(true);
    });
});
