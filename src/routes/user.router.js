import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(
    upload.none(),// aise bahot sare route honge jaha ham multer ka user nahi karenge to samajh jana   ""  console.log("Content-Type:", req.headers["content-type"]); "" main issue yahi hai
    loginUser
)

//secure routes
router.route("/logout").post(verifyJwt, logoutUser)

export default router;