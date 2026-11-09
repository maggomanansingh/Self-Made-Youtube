import Router from "express";
import { registerUser,
    loginUser,
    logoutUser, 
    refreshAccesstoken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]) ,
    registerUser
)

// Login route
router.route("/login").post(loginUser)

// securedRoutes
router.route("/logout").post(verifyJWT , logoutUser)

// refresh accesstokens token
router.route("/refresh-token").post(refreshAccesstoken)

// change user password
router.route("/change-password").patch(verifyJWT,changeCurrentUserPassword)

// get user details
router.route("/get-user").get(verifyJWT,getCurrentUser)

// update user details
router.route("/update-user").patch(verifyJWT,updateAccountDetails)

// update user details
router.route("/update-avatar").patch(verifyJWT,updateUserAvatar)

// update user details
router.route("/update-coverimage").patch(verifyJWT,updateUserCoverImage)

export default router