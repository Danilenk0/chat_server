import { Router } from "express";
import { signup as signupValidator, signin as signinValidator } from '../lib/validations.js'

import {signup, signin, logout} from '../controllers/auth.controller.js'

const router = Router();

router.post('/signup', signupValidator, signup)
router.post('/signin',signinValidator, signin)
router.post('/logout',logout)

export default router;