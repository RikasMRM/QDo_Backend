import express from 'express'
import userController from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

//@Public Register user
router.route('/register').post(userController.registerUser)

//@Public Login user
router.route('/login').post(userController.loginUser)

//Auth User
router.route('/:id').get(protect, userController.getUserProfileData)

export default router