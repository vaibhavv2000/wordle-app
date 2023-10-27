import { Router } from "express";
import { gameWon, getWord, newGame } from "../../Controllers/GameController";
import { isAuth } from "../../Middleware/IsAuth";

const router: Router = Router();

router.get("/getword", isAuth, getWord);

router.patch("/newgame", isAuth, newGame);

router.patch("/gamewon", isAuth, gameWon);

export { router as GameRouter };
