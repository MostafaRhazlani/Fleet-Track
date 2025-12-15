import express from 'express';
import DashboardRepository from '../repositories/vehicle.repository.js';
import TripRepository from '../repositories/trip.repository.js';
import TireRepository from '../repositories/tire.repository.js';
import DashboardService from '../services/dashboard.service.js';
import DashboardController from '../controllers/dashboard.controller.js';
import AuthGuard from '../middleware/auth.guard.js';

const router = express.Router();

const vehicleRepo = new DashboardRepository();
const tripRepo = new TripRepository();
const tireRepo = new TireRepository();
const dashboardService = new DashboardService(vehicleRepo, tripRepo, tireRepo);
const dashboardController = new DashboardController(dashboardService);
const authGuard = new AuthGuard();

router.get('/admin', authGuard.requireAuth.bind(authGuard), authGuard.requireRole('Admin'), dashboardController.adminDashboard);
router.get('/driver', authGuard.requireAuth.bind(authGuard), authGuard.requireRole('Driver'), dashboardController.driverDashboard);

export default router;
