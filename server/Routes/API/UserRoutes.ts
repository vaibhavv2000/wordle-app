import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  searchUser,
  searchUsers,
  updateUser,
} from "../../Controllers/UserController";
import { isAuth } from "../../Middleware/IsAuth";

const router: Router = Router();

router.get("/searchusers", isAuth, searchUsers);

router.delete("/deleteuser", isAuth, deleteUser);

router.patch("/changepassword", isAuth, changePassword);

router.get("/getuser", isAuth, getUser);

router.patch("/updateuser", isAuth, updateUser);

router.get("/searchuser", isAuth, searchUser);

export { router as UserRouter };
