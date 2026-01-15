import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route("/login").post(loginUser); // user logiin


// secured rouets
router.route("/logout").post(verifyJWT ,logoutUser)


export default router;