import { Router } from "express";
import { protectRoute } from '../middleware/auth.middleware.js';
import { signup, signin, logout, updateProfile, checkAuth} from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile)

router.get('/check',protectRoute, checkAuth)

export default router;