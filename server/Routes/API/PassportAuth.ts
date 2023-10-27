import {ISession} from "./../../Controllers/AuthController";
import {Router} from "express";
import passport from "passport";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {I_User} from "../../Models/User";

const router: Router = Router();

router.get(
  '/auth/google',
  passport.authenticate('google',{scope: ["profile","email"]})
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google",{failureRedirect: "/"}),
  function(req,res) {
    const user = req.user as I_User;

    const token: string = jwt.sign(
      {id: String(user?._id),username: user?.username},
      process.env.JWT_KEY as string,
      {expiresIn: "30d",}
    );

    (req.session as ISession).userId = String(user?._id);

    return res
      .status(200)
      .cookie("aT",token,{maxAge: 1000 * 60 * 60 * 24,httpOnly: true})
      .redirect("/wordle");

    // return res.status(200).redirect(`myapp://auth/${user?.username}/ok@gmail.com`);

  }
);

export {router as passportRouter};
