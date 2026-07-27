import express  from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const router = express.Router()


/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

router.post(
	"/",
	authMiddleware.authMiddleware,
	transactionController.createTransaction,
);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */

router.post(
	"/system/initial-funds",
	authMiddleware.authSystemUserMiddleware,
	transactionController.createInitialFundsTransaction,
);


export default router;