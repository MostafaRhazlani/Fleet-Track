import express from 'express';
import VehicleRepository from '../repositories/vehicle.repository.js';
import VehicleService from '../services/vehicle.service.js';
import VehicleController from '../controllers/vehicle.controller.js';
import VehicleMiddleware from '../middleware/vehicle.validation.js';
import upload from '../config/multer.js';

const router = express.Router();

const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);
const vehicleMiddleware = new VehicleMiddleware();

router.post('/create', upload.single('image'), vehicleMiddleware.validateVehicle(), vehicleController.create.bind(vehicleController));
router.get('/vehicles', vehicleController.getAll.bind(vehicleController));
router.get('/:id', vehicleController.getById.bind(vehicleController));
router.put('/:id/update', upload.single('image'), vehicleMiddleware.validateVehicle(), vehicleController.update.bind(vehicleController));
router.delete('/:id/delete', vehicleController.delete.bind(vehicleController));

export default router;
