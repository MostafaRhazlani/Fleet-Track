import { beforeEach, describe, expect, jest } from "@jest/globals"

const { default: TripService } = await import('../src/services/trip.service.js');

describe('TripService', () => {
    let tripService;
    let mockTripRepository;

    beforeEach(() => {
        mockTripRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByDriver: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        tripService = new TripService(mockTripRepository);
    });

    it('forwards CRUD calls to repository', async () => {
        mockTripRepository.create.mockResolvedValue({ id: 1 });
        await expect(tripService.createTrip({})).resolves.toEqual({ id: 1 });
        expect(mockTripRepository.create).toHaveBeenCalled();

        mockTripRepository.findAll.mockResolvedValue([{ id: 1 }]);
        await expect(tripService.getAllTrips()).resolves.toEqual([{ id: 1 }]);

        mockTripRepository.findByDriver.mockResolvedValue([]);
        await expect(tripService.getTripsByDriver('d')).resolves.toEqual([]);

        mockTripRepository.findById.mockResolvedValue({ id: 2 });
        await expect(tripService.getTripById(2)).resolves.toEqual({ id: 2 });

        mockTripRepository.update.mockResolvedValue({ ok: true });
        await expect(tripService.updateTrip(2, {})).resolves.toEqual({ ok: true });

        mockTripRepository.delete.mockResolvedValue(true);
        await expect(tripService.deleteTrip(2)).resolves.toEqual(true);
    });

    it('generateTripPdf returns a Buffer', async () => {
        const trip = {
            _id: 'abcdef123',
            from: 'A',
            to: 'B',
            status: 'ongoing',
            driver: { first_name: 'John', last_name: 'Doe' },
            startDate: new Date(),
            endDate: new Date(),
            notes: 'some notes'
        };

        const buf = await tripService.generateTripPdf(trip);
        expect(Buffer.isBuffer(buf)).toBe(true);
        expect(buf.length).toBeGreaterThan(0);
    });
});
