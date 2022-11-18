import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

//@Public Register user
router.route('/register').post(userController.registerUser)

//@Public Login user
router.route('/login').post(userController.loginUser)

export default router