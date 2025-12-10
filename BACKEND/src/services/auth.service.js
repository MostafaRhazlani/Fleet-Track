import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomThrowError from "../helpers/custom.throw.error.js";

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    }

    signToken(user) {
        const payload = {
            id: user._id,
            role: user.role,
            email: user.email,
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    }

    async register(data) {
        const { email } = data;
        const exists = await this.userRepository.findByEmail(email);
        if (exists) throw CustomThrowError('emailExist' ,'Email already registered', 409);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        const user = await this.userRepository.create({...data, password: hashPassword});
        return { user: user.toJSON() };
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw CustomThrowError('invalidCredentials' ,'Invalid credentials', 400);

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw CustomThrowError('invalidCredentials' ,'Invalid credentials', 400);

        // Set status to Active on login
        if (user.status !== 'Active') {
            user.status = 'Active';
            await user.save();
        }

        const token = this.signToken(user);
        return { user: user.toJSON(), token };
    }
}

export default AuthService;
