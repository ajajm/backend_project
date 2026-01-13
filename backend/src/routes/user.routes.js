import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// After /user these routes will active
router.route("/register").post(registerUser); // Register

export default router;