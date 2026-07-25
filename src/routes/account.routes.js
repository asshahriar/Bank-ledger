import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js';
import accountController from '../controllers/account.controller.js';

const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)



export default router;