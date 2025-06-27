import { Router } from "express";
import { signup as signupValidator, signin as signinValidator } from '../lib/validations.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { signup, signin, logout, updateProfile, checkAuth} from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signupValidator, signup)
router.post('/signin',signinValidator, signin)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile)

router.get('/check',protectRoute, checkAuth)

export default router;