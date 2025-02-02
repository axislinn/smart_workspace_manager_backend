import express from 'express';
import { signup } from '../../controller/users/employee_controller.js';

const router = express.Router();

// Employee Sign Up Route
router.post('/signup', signup);

export default router;
