import bcrypt from "bcrypt";
import {NextFunction,Request,Response} from "express";
import Game from "../Models/Game";
import User from "../Models/User";

type NF = NextFunction;

export const searchUsers = async (req: Request,res: Response,next: NF) => {
  const {user} = req.query;

  if(!user?.length) return res.status(400).send({msg: "Enter query"});

  try {
    const users = await User.find({
      $or: [{name: {$regex: user}},{username: {$regex: user}}],
    })
      .lean()
      .select("username name profile -_id");

    return res.status(200).send({users});
  } catch(error) {
    next(error);
  }
};

export const deleteUser = async (req: Request,res: Response,next: NF) => {
  const {id} = res.locals;

  try {
    await User.findOneAndDelete(id);

    await Game.deleteOne({userId: id});

    req.session.destroy(() => {
      req.logout((err) => {
        if(err) return next(err);
      });
    });

    res.clearCookie("aT");
    res.clearCookie("session");

    return res.status(200).json({msg: "Account deleted"});
  } catch(error) {
    next(error);
  }
};

export const changePassword = async (req: Request,res: Response,next: NF) => {
  const {id} = res.locals;
  const {old_pwd,new_pwd,confirm_new_pwd} = req.body;

  if(!old_pwd || !new_pwd || !confirm_new_pwd) {
    return res.status(400).json({msg: "All fields are required"});
  }

  try {
    const getUser = await User.findById(id).lean().select("password");

    if(!getUser) return res.status(404).json({msg: "User not found"});

    const isPwd: boolean = await bcrypt.compare(old_pwd,getUser.password);

    if(!isPwd) return res.status(400).json({msg: "Wrong password"});

    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(new_pwd,salt);

    await User.findByIdAndUpdate(id,{
      $set: {password: hash},
    });

    return res
      .status(201)
      .json({msg: "Password updated successfully",success: true});
  } catch(error) {
    next(error);
  }
};

export const getUser = async (req: Request,res: Response,next: NF) => {
  const {id} = res.locals;

  const {userId} = req.query;

  let user;

  try {
    if(userId) {
      user = await User.findById(userId).lean().select("profile username");
    } else {
      user = await User.findById(id)
        .lean()
        .select("name username email profile cover");
    }

    return res.status(200).json({user});
  } catch(error) {
    next(error);
  }
};

export const updateUser = async (req: Request,res: Response,next: NF) => {
  const {id} = res.locals;

  try {
    await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {new: true}
    );

    return res.status(200).json({success: true,msg: "Account updated"});
  } catch(error) {
    next(error);
  }
};

export const searchUser = async (req: Request,res: Response,next: NF) => {
  const {user} = req.query;
  const {username} = res.locals;

  try {
    if(!user) {
      const getUser = await User.findOne({username})
        .lean()
        .select("_id username name profile cover")

      if(getUser) {
        return res.status(200).json({
          name: getUser.name,
          username: getUser.username,
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

        return res.status(200).json({
          name: getUser.name,
          username: getUser.username,
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
  } catch(error) {
    next(error);
  }
};
