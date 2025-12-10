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
            return res.status(200).json({ status: "success", user: result.user, token: result.token });
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
}

export default AuthController
