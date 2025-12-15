import { body } from "express-validator";
import validate from "./error.handler.js";

class VehicleMiddleware {
    validateVehicle() {
        return [
            body("plateNumber").notEmpty().withMessage("Plate number is required"),
            body("brand").notEmpty().withMessage("Brand is required"),
            body("model").notEmpty().withMessage("Model is required"),
            body("maxLoad").notEmpty().withMessage("Max load is required"),
            body("vehicleType")
                .isIn(["Truck", "Trailer"])
                .withMessage("Vehicle type must be Truck or Trailer"),
            body("totalMileage")
                .optional()
                .isNumeric()
                .withMessage("Total mileage must be a number"),
            body("lastTripDistance")
                .optional()
                .isNumeric()
                .withMessage("Last trip distance must be a number"),
            body("totalFuelConsumed")
                .optional()
                .isNumeric()
                .withMessage("Total fuel consumed must be a number"),
            body("lastFuelAdded")
                .optional()
                .isNumeric()
                .withMessage("Last fuel added must be a number"),
            body("status")
                .optional()
                .isIn(["Available", "In-transit", "Maintenance", "Out-service"]),
            body("lastOilChangeMileage")
                .optional()
                .isNumeric()
                .withMessage("Last oil change mileage must be a number"),
            body("currentDriver")
                .optional()
                .isMongoId()
                .withMessage("Current driver must be a valid user ID"),
            validate,
        ];
    }
}
export default VehicleMiddleware;
