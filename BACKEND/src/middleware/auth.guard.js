import jwt from "jsonwebtoken";

class AuthGuard {
  constructor({ jwtSecret = process.env.JWT_SECRET } = {}) {
    this.jwtSecret = jwtSecret;
    this.requireAuth = this.requireAuth.bind(this);
    this.requireRole = this.requireRole.bind(this);
  }

  requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "error", message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      next();
    } catch (error) {
      return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }
  }

  requireRole(...roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ status: "error", message: "Forbidden: You don\'t have permissions" });
      }
      next();
    };
  }
}

export default AuthGuard;
