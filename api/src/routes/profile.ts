import { Router } from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateProfileSchema } from '../schemas/authSchemas.js';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.patch('/', authMiddleware, validate(updateProfileSchema), updateProfile);
router.delete('/', authMiddleware, deleteProfile);

export default router;
