import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  regsiterConfirm,
  resetPassword,
} from "../../Controllers/AuthController";
import { isAuth } from "../../Middleware/IsAuth";

const router: Router = Router();

router.post("/register", register);

router.post("/register/confirm", regsiterConfirm);

router.post("/login", login);

router.post("/logout", isAuth, logout);

router.post("/forgotpassword", forgotPassword);

router.post("/resetpassword", resetPassword);

export { router as AuthRouter };
