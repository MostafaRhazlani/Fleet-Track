import { body } from "express-validator";
import validate from "./error.handler.js";

class TireMiddleware {
    validateTire() {
        return [
            body("serialNumber").notEmpty().withMessage("Serial number is required"),
            body("brand").notEmpty().withMessage("Brand is required"),
            body("model").notEmpty().withMessage("Model is required"),
            body("size").notEmpty().withMessage("Size is required"),
            body("status").optional().isIn(["New", "In-use", "Maintenance", "Retired"]),
            body("position").optional().isIn(["front-left", "front-right", "rear-left", "rear-right"]).withMessage("Position must be one of front-left, front-right, rear-left, rear-right"),
            body("installedOn").optional().isMongoId().withMessage("installedOn must be a valid vehicle ID"),
            body("usedMileage").optional().isNumeric().withMessage("Used mileage must be a number"),
            validate,
        ];
    }
}

export default TireMiddleware;
