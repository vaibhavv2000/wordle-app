import {Request,Response,Router} from "express";
import {isAlreadyAuth,isWebAuth} from "../../Middleware/isWebAuth";
import Game from "../../Models/Game";
import User from "../../Models/User";

const router: Router = Router();

router.get("/",isAlreadyAuth,(_,res: Response) => res.render("login"));

router.get("/register",isAlreadyAuth,(_,res: Response) =>
  res.render("register")
);

router.get("/wordle",isWebAuth,async (_,res: Response) => {
  const {id,username} = res.locals;

  try {
    const gameStats = await Game.findOne({userId: id})
      .lean()
      .select("totalMatches won");

    return res.render("wordle",{totalMatches: gameStats?.totalMatches,won: gameStats?.won});
  } catch(error) {
    if(error instanceof Error) {
      return res.status(500).send({error: error.message});
    }
  }
});

router.get("/forgotpassword",isAlreadyAuth,(_,res: Response) =>
  res.render("forgotpassword")
);

router.get("/bootstrap",(_,res: Response) => res.render("bootstrap"));

router.get("/tailwind",(_,res: Response) => res.render("tailwind"));

router.get("/music",(_,res: Response) => res.render("music"));

router.get("/video",(_,res: Response) => res.render("video"));

router.get("/profile",isWebAuth,async (req: Request,res: Response) => {
  const {user} = req.query;
  const {username} = res.locals;

  if(!user) {
    const getUser = await User.findOne({username})
      .lean()
      .select("_id username name profile cover");

    if(getUser) {

      let currentUser: boolean = username === getUser.username;

      return res.status(200).render("profile",{
        name: getUser.name,
        username: getUser.username,
        currentUser,
        userId: getUser._id,
        profile:
          getUser.profile ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShj8GWstb1F4vT8EcpQ-4ANeptr6aMFhpG-w&usqp=CAU",
        cover:
          getUser.cover ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvj2_Ocg29zF6vz2IepBqxucvDSYO_72zqSw&usqp=CAU",
      });
    }
  } else {
    const getUser = await User.findOne({username: user})
      .lean()
      .select("_id username name profile cover");

    if(getUser) {

      let currentUser: boolean = username === getUser.username;

      return res.status(200).render("profile",{
        name: getUser.name,
        username: getUser.username,
        currentUser,
        userId: getUser._id,
        profile:
          getUser.profile ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShj8GWstb1F4vT8EcpQ-4ANeptr6aMFhpG-w&usqp=CAU",
        cover:
          getUser.cover ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvj2_Ocg29zF6vz2IepBqxucvDSYO_72zqSw&usqp=CAU",
      });
    }
  }
});

router.get("/search",isWebAuth,(_,res: Response) => res.render("search"));

router.get("/settings",isWebAuth,(_,res: Response) =>
  res.render("settings")
);

router.get("/account",isWebAuth,(_,res: Response) => {
  const {username} = res.locals;

  res.render("account",{username});
});

router.get("/changepassword",isWebAuth,(_,res: Response) =>
  res.render("changepassword")
);

export {router as WebRouter};
