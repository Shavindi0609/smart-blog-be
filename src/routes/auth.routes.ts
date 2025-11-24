import { Router } from 'express';
import {
  register,
  login,
  getMe,
  adminRegister
} from '../controller/auth.controller'; // ✅ note the folder name is 'controllers'

const router = Router();

// Define routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.post('/admin/register', adminRegister);

export default router;
