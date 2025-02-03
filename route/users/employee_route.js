import express from 'express';
import { signup, login } from '../../controller/users/employee_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
