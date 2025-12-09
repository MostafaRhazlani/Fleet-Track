import { body } from "express-validator";
import validate from "./error.handler.js";

class AuthMiddleware {
    validateRegister() {
        return [
            body("first_name").notEmpty().withMessage("First name is required"),
            body("last_name").notEmpty().withMessage("Last name is required"),
            body("email").isEmail().withMessage("Valid email is required"),
            body("phone").isLength({ min: 10, max: 14 }).withMessage("Invalid phone number"),
            body("password")
                .isLength({ min: 6 })
                .withMessage("Password min length is 6"),
            body("role")
                .optional()
                .isIn(["Admin", "Driver"])
                .withMessage("Invalid role"),
            validate,
        ];
    }

    validateLogin() {
        return [
            body("email").isEmail().withMessage("Valid email is required"),
            body("password").notEmpty().withMessage("Password is required"),
            validate,
        ];
    }
}

export default AuthMiddleware
