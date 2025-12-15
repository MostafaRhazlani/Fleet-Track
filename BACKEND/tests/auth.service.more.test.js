import { beforeEach, describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule('bcryptjs', () => {
    const impl = {
        genSalt: jest.fn().mockResolvedValue('salt'),
        hash: jest.fn().mockResolvedValue('hashedpwd'),
        compare: jest.fn().mockResolvedValue(true),
    };
    return { default: impl, ...impl };
});

jest.unstable_mockModule('jsonwebtoken', () => {
    const impl = { sign: jest.fn(() => 'signed-token') };
    return { default: impl, ...impl };
});

const { default: AuthService } = await import('../src/services/auth.service.js');
const { default: bcrypt } = await import('bcryptjs');
const { default: jwt } = await import('jsonwebtoken');

describe('AuthService (additional)', () => {
    let authService;
    let mockUserRepository;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
            findDrivers: jest.fn(),
        };

        authService = new AuthService(mockUserRepository);
    });

    it('registers a user when email not present', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({ toJSON: () => ({ id: 'u1', email: 'a@b.com' }) });

        const res = await authService.register({ email: 'a@b.com', password: 'pass' });

        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith('pass', 'salt');
        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(res).toEqual({ user: { id: 'u1', email: 'a@b.com' } });
    });

    it('logs in a user successfully and returns token', async () => {
        const user = { _id: 'u2', email: 'x@y.com', password: 'hashedpwd', status: 'Inactive', save: jest.fn().mockResolvedValue(true), toJSON: () => ({ id: 'u2', email: 'x@y.com' }) };
        mockUserRepository.findByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);

        const res = await authService.login({ email: 'x@y.com', password: 'plain' });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('x@y.com');
        expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashedpwd');
        expect(user.save).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalled();
        expect(res).toHaveProperty('token', 'signed-token');
        expect(res).toHaveProperty('user');
    });

    it('returns drivers list', async () => {
        const drivers = [{ id: 1 }, { id: 2 }];
        mockUserRepository.findDrivers.mockResolvedValue(drivers);
        const res = await authService.getDrivers();
        expect(res).toEqual(drivers);
        expect(mockUserRepository.findDrivers).toHaveBeenCalled();
    });
});
