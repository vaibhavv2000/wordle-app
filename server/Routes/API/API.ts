import {Router} from "express";
import {isAuth} from "../../Middleware/IsAuth";
import {AuthRouter} from "./AuthRoutes";
import {GameRouter} from "./GameRoutes";
import {UserRouter} from "./UserRoutes";

const router: Router = Router();

router.use("/auth",AuthRouter);

router.use("/user",isAuth,UserRouter);

router.use("/game",GameRouter);

export {router as API};
