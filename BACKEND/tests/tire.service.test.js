import { beforeEach, describe, expect, jest } from "@jest/globals"

jest.unstable_mockModule('../src/helpers/custom.throw.error.js', () => ({
    default: jest.fn((field, message, code) => {
        return { field, message, code, isCustomError: true };
    }),
}));

const { default: TireService } = await import('../src/services/tire.service.js');
const { default: CustomThrowError } = await import('../src/helpers/custom.throw.error.js');

describe('TireService', () => {
    let tireService;
    let mockTireRepository;

    beforeEach(() => {
        mockTireRepository = {
            findBySerial: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        CustomThrowError.mockClear();
        tireService = new TireService(mockTireRepository);
    });

    describe('createTire', () => {
        it('creates when serial does not exist', async () => {
            const data = { serialNumber: 'S1' };
            mockTireRepository.findBySerial.mockResolvedValue(null);
            mockTireRepository.create.mockResolvedValue({ id: 1, ...data });
            const result = await tireService.createTire(data);
            expect(mockTireRepository.findBySerial).toHaveBeenCalledWith('S1');
            expect(mockTireRepository.create).toHaveBeenCalledWith(data);
            expect(result).toEqual({ id: 1, ...data });
        });

        it('throws if serial exists', async () => {
            mockTireRepository.findBySerial.mockResolvedValue({ id: 2, serialNumber: 'S1' });
            await expect(tireService.createTire({ serialNumber: 'S1' })).rejects.toEqual({
                field: 'serialNumber',
                message: 'Serial number already exists',
                code: 409,
                isCustomError: true
            });
        });
    });

    it('getAllTires calls repository', async () => {
        const list = [{ id: 1 }];
        mockTireRepository.findAll.mockResolvedValue(list);
        const res = await tireService.getAllTires();
        expect(mockTireRepository.findAll).toHaveBeenCalled();
        expect(res).toEqual(list);
    });

    it('getTireById calls repository', async () => {
        const item = { id: 1 };
        mockTireRepository.findById.mockResolvedValue(item);
        const res = await tireService.getTireById(1);
        expect(mockTireRepository.findById).toHaveBeenCalledWith(1);
        expect(res).toEqual(item);
    });

    it('updateTire calls repository', async () => {
        const data = { usedMileage: 100 };
        mockTireRepository.update.mockResolvedValue(data);
        const res = await tireService.updateTire(1, data);
        expect(mockTireRepository.update).toHaveBeenCalledWith(1, data);
        expect(res).toEqual(data);
    });

    it('deleteTire calls repository', async () => {
        mockTireRepository.delete.mockResolvedValue(true);
        const res = await tireService.deleteTire(1);
        expect(mockTireRepository.delete).toHaveBeenCalledWith(1);
        expect(res).toBe(true);
    });
});
