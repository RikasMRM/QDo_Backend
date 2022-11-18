import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

//@Public Register user
router.route('/register').post(userController.registerUser)

export default router