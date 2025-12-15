import { beforeEach, describe, expect, jest } from "@jest/globals"

jest.unstable_mockModule('../src/helpers/custom.throw.error.js', () => ({
    default: jest.fn((field, message, code) => {
        return { field, message, code, isCustomError: true };
    }),
}));

// Mock Maintenance model to avoid DB calls in service during tests
jest.unstable_mockModule('../src/models/maintenance.model.js', () => ({
    default: {
        findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ rules: [] }) }),
    }
}));

// Mock Tire model to avoid DB calls in service during tests
jest.unstable_mockModule('../src/models/tire.model.js', () => ({
    default: {
        find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }),
    }
}));

const { default: VehicleService } = await import('../src/services/vehicle.service.js');
const { default: CustomThrowError } = await import('../src/helpers/custom.throw.error.js');

describe('VehicleService', () => {
    let vehicleService;
    let mockVehicleRepository;

    beforeEach(() => {
        mockVehicleRepository = {
            findByPlateNumber: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }

        CustomThrowError.mockClear();

        vehicleService = new VehicleService(mockVehicleRepository);
    });

    describe('createVehicle', () => {
        it('Should create a vehicle successfuly if plate number does not exist', async () => {
            const mockData = { plateNumber: 'ABC123', model: 'Truck' };

            mockVehicleRepository.findByPlateNumber.mockResolvedValue(null);
            mockVehicleRepository.create.mockResolvedValue({ id: 1, ...mockData });

            const result = await vehicleService.createVehicle(mockData);

            expect(mockVehicleRepository.findByPlateNumber).toHaveBeenCalledWith('ABC123');
            expect(mockVehicleRepository.create).toHaveBeenCalledWith(mockData);
            expect(result).toMatchObject({ id: 1, ...mockData });
        });

        it('Should throw an error if plate number already exist', async () => {
            const mockData = { plateNumber: 'ABC123' };

            mockVehicleRepository.findByPlateNumber.mockResolvedValue({ id: 2, plateNumber: 'ABC123' });

            await expect(vehicleService.createVehicle(mockData)).rejects.toEqual({
                field: 'plateNumber',
                message: 'Plate number already exists',
                code: 409,
                isCustomError: true
            });

            expect(mockVehicleRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllVehicles', () => {
        it('should return list of vehicles', async () => {
            const mockData = [{ id: 1, id: 2 }];
            mockVehicleRepository.findAll.mockResolvedValue(mockData);
            const result = await vehicleService.getAllVehicles();

            expect(mockVehicleRepository.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(mockData.length);
            expect(result[0]).toMatchObject(mockData[0]);
        })
    });

    describe('getVehicleById', () => {
        it('should return a vehicle by id', async () => {
            const mockVehicle = { id: 1 };
            mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
            const result = await vehicleService.getVehicleById(1);
            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toMatchObject(mockVehicle);
        })
    })

    describe('updateVehicle', () => {
        it('should update the vehicle', async () => {
            const updateData = { model: '2025' };
            mockVehicleRepository.update.mockResolvedValue(updateData);
            const result = await vehicleService.updateVehicle(1, updateData);
            expect(mockVehicleRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toMatchObject(updateData);
        })
    });

    describe('deleteVehicle', () => {
        it('should delete the vehicle', async () => {
            mockVehicleRepository.delete.mockResolvedValue(true);
            const result = await vehicleService.deleteVehicle(1);
            expect(mockVehicleRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        })
    })
});