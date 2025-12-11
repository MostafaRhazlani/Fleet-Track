import jwt from "jsonwebtoken";

class AuthGuard {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.requireAuth = this.requireAuth.bind(this);
    this.requireRole = this.requireRole.bind(this);
  }

  requireAuth(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ status: "error", message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;

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
