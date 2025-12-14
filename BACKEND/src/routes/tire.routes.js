import express from 'express';
import TireRepository from '../repositories/tire.repository.js';
import TireService from '../services/tire.service.js';
import TireController from '../controllers/tire.controller.js';
import TireMiddleware from '../middleware/tire.validation.js';
import upload from '../config/multer.js';

const router = express.Router();

const tireRepository = new TireRepository();
const tireService = new TireService(tireRepository);
const tireController = new TireController(tireService);
const tireMiddleware = new TireMiddleware();

router.post('/create', upload.single('image'), tireMiddleware.validateTire(), tireController.create.bind(tireController));
router.get('/tires', tireController.getAll.bind(tireController));
router.get('/:id', tireController.getById.bind(tireController));
router.put('/:id/update', upload.single('image'), tireMiddleware.validateTire(), tireController.update.bind(tireController));
router.delete('/:id/delete', tireController.delete.bind(tireController));

export default router;
