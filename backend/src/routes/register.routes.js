import { Router } from "express";
import { registerUser } from "../controllers/register.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([     //injecting middleware, for file uploading
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
) // Regisetr

export default router;