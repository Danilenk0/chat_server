import { Router } from "express";
import {signup as signupValidator} from '../lib/validations.js'
import {signup} from '../controllers/auth.controller.js'

const router = Router();

router.post('/signup', signupValidator, signup)
// router.post('/signin')
// router.post('/logout')

export default router;