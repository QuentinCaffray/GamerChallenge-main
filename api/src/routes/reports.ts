import { Router } from 'express';
import { createReport } from '../controllers/reportsController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createReportSchema } from '../schemas/reportSchemas.js';

const router = Router();

router.post('/', authMiddleware, validate(createReportSchema), createReport);

export default router;