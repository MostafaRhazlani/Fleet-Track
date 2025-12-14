import { body } from "express-validator";
import validate from "./error.handler.js";

class TripMiddleware {
  validateTrip() {
    return [
      body("from").notEmpty().withMessage("From is required"),
      body("to").notEmpty().withMessage("To is required"),
      body("driver").notEmpty().isMongoId().withMessage("Driver must be a valid ID"),
      body("status").optional().isIn(["planned", "started", "stopped", "completed"]),
      body("startDate").optional().isISO8601().toDate(),
      body("endDate").optional().isISO8601().toDate(),
      validate,
    ];
  }
}

export default TripMiddleware;
