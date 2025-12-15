import { beforeEach, describe, expect, jest } from "@jest/globals"

jest.unstable_mockModule('../src/helpers/custom.throw.error.js', () => ({
    default: jest.fn((field, message, code) => {
        return { field, message, code, isCustomError: true };
    }),
}));

const { default: AuthService } = await import('../src/services/auth.service.js');
const { default: CustomThrowError } = await import('../src/helpers/custom.throw.error.js');

describe('AuthService', () => {
    let authService;
    let mockUserRepository;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
        };

        CustomThrowError.mockClear();

        authService = new AuthService(mockUserRepository);
    });

    describe('register', () => {
        it('throws if email already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: 'a@b.com' });
            await expect(authService.register({ email: 'a@b.com' })).rejects.toEqual({
                field: 'emailExist',
                message: 'Email already registered',
                code: 409,
                isCustomError: true
            });
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('calls repository to update status when userId provided', async () => {
            mockUserRepository.updateStatus.mockResolvedValue(true);
            await authService.logout('user123');
            expect(mockUserRepository.updateStatus).toHaveBeenCalledWith('user123', 'Inactive');
        });

        it('does nothing when no userId provided', async () => {
            await expect(authService.logout()).resolves.toBeUndefined();
        });
    });

    describe('login', () => {
        it('throws when user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(authService.login({ email: 'x@y.com', password: 'p' })).rejects.toEqual({
                field: 'invalidCredentials',
                message: 'Invalid credentials',
                code: 400,
                isCustomError: true
            });
        });
    });
});
