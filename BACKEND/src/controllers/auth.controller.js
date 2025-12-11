class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(req, res) {
        try {
            const result = await this.authService.register(req.body);
            return res.status(201).json({ status: "success", data: { user: result.user } });
        } catch (error) {
            const statucCode = error.statucCode || 500;
            return res.status(statucCode).json({ 
                status: "error", 
                errors: {
                    [error.field] : error.message
                } 
            });
        }
    }

    async login(req, res) {
        try {
            const result = await this.authService.login(req.body);

            res.cookie('token', result.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: false,
            });

            return res.status(200).json({ status: "success", user: result.user });
        } catch (error) {
            const statucCode = error.statucCode || 500;
            return res.status(statucCode).json({ 
                status: "error", 
                errors: {
                    [error.field] : error.message
                } 
            });
        }
    }

    logout(req, res) {

        const user = req.user;
        if (user && user.id) {
            this.authService.logout(user.id);
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, 
        });
        return res.status(200).json({ status: "success", message: "Logged out successfully" });
    }

    async getAutenticatedUser(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({ status: "success", user });
        } catch (error) {
            return res.status(401).json({ status: "error", message: "You are not logged in yet" });
        }
    }
}

export default AuthController
