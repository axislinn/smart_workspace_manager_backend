import express from 'express';
import { signup } from '../../controller/users/admin_controller.js';

const router = express.Router();

// Admin Sign Up Route
router.post('/signup', signup);

export default router;
