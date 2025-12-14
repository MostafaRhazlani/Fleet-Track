import express from 'express';
import TripRepository from '../repositories/trip.repository.js';
import TripService from '../services/trip.service.js';
import TripController from '../controllers/trip.controller.js';
import TripMiddleware from '../middleware/trip.validation.js';
import AuthGuard from '../middleware/auth.guard.js';

const router = express.Router();

const tripRepository = new TripRepository();
const tripService = new TripService(tripRepository);
const tripController = new TripController(tripService);
const tripMiddleware = new TripMiddleware();
const authGuard = new AuthGuard();

router.post('/create', tripMiddleware.validateTrip(), tripController.create.bind(tripController));
router.get('/trips', tripController.getAll.bind(tripController));
router.get('/my-trips', authGuard.requireAuth, authGuard.requireRole('Driver'), tripController.getByDriver.bind(tripController));
router.patch('/:id/status', authGuard.requireAuth, tripController.updateStatus.bind(tripController));
router.get('/:id/pdf', authGuard.requireAuth, tripController.generatePdf.bind(tripController));
router.get('/:id', tripController.getById.bind(tripController));
router.put('/:id/update', tripMiddleware.validateTrip(), tripController.update.bind(tripController));
router.delete('/:id/delete', tripController.delete.bind(tripController));

export default router;
