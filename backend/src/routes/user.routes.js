import { Router } from "express";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// After /user these routes will active
router.route("/login").post(loginUser); // user logiin

export default router;