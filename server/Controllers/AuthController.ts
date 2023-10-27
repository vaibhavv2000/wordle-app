import {NextFunction,Request,Response} from "express";
import User,{I_User} from "../Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {transporter} from "../Config/email";
import {Session} from "express-session";
import Game from "../Models/Game";

export interface ISession extends Session {
  userId?: string;
}

type NF = NextFunction;
interface register_body {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const register = async (req: Request,res: Response,next: NF) => {
  const {name,email,password,username,confirmPassword} =
    req.body as register_body;

  if(!name || !email || !password || !confirmPassword || !username) {
    return res.status(400).send({
      error: "field",
      msg: "All fields are necessary",
    });
  }

  try {
    const userExists = await User.findOne({
      $or: [{username},{email}],
    })
      .lean()
      .select("username email");

    if(userExists) {
      if(userExists.username === username) {
        return res.status(400).send({
          error: "username",
          msg: "Username already taken",
        });
      } else if(userExists.email === email) {
        return res.status(400).send({
          error: "email",
          msg: "Email already exists",
        });
      }
    }

    if(username.length < 3 || username.length > 30) {
      return res.status(400).send({
        error: "username-length",
        msg: "Username should be between 3 to 30 Characters",
      });
    }

    if(password.length < 8) {
      return res.status(400).send({
        error: "password",
        msg: "Password should be atleast min 8 char",
      });
    }

    if(password !== confirmPassword) {
      return res.status(400).send({
        error: "password mismatch",
        msg: "Passwords don't match with each other",
      });
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashPwd: string = await bcrypt.hash(password,salt);

    const randomNumber: number = Math.floor(Math.random() * 10000 + 999);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Register OTP",
      html: `
      <h4>${randomNumber}</h4>
      <br /> 
      <p>Account creation code, This code will only work for 5 minutes</p>
      `,
    });

    const token: string = jwt.sign(
      {num: randomNumber},
      process.env.JWT_KEY as string,
      {
        expiresIn: "5m",
      }
    );

    return res.status(200).send({
      msg: "ok",
      user: {
        name,
        email,
        password: hashPwd,
        username,
        token,
      },
    });
  } catch(error) {
    next(error);
  }
};

export const regsiterConfirm = async (
  req: Request,
  res: Response,
  next: NF
) => {
  const {name,email,password,username,token,otp,mobile} =
    req.body as register_body & {token: string; otp: number; mobile: boolean};

  jwt.verify(token,process.env.JWT_KEY as string,async (err,user: any) => {
    if(err) return res.status(401).send({err});

    if(String(user.num) !== String(otp)) {
      return res.status(401).json("Wrong OTP");
    } else {
      const user = new User({
        name,
        email,
        password,
        username,
      });

      try {
        const newUser = await user.save();

        console.log(newUser);

        if(!mobile) {
          const game = new Game({
            userId: newUser._id,
          });

          await game.save();

          (req.session as ISession).userId = String(newUser._id);
        }

        const token: string = jwt.sign(
          {id: String(newUser._id),username},
          process.env.JWT_KEY as string,
          {expiresIn: "30d"}
        );

        if(!mobile) {
          return res
            .status(201)
            .cookie("aT",token,{
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 30,
            })
            .send({msg: "success"});
        }

        return res.status(201).json({
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            username: newUser.username,
          },
          token,
        });
      } catch(error) {
        next(error);
      }
    }
  });
};

export const login = async (req: Request,res: Response,next: NF) => {
  const {user,password,mobile} = req.body;

  if(!user || !password) {
    return res.status(400).send({msg: "All fields are necessary"});
  }

  try {
    const checkUser = await User.findOne({
      $or: [{username: user},{email: user}],
    })
      .lean()
      .select("username email name password _id");

    if(!checkUser) {
      return res.status(400).send({msg: "User doesn't exist"});
    }

    const pwd: boolean = await bcrypt.compare(password,checkUser.password);

    if(!pwd) {
      return res.status(400).send({msg: "Email or password might be wrong"});
    }

    const token: string = jwt.sign(
      {id: String(checkUser._id),username: checkUser.username},
      process.env.JWT_KEY as string,
      {
        expiresIn: "30d",
      }
    );

    if(!mobile) {
      (req.session as ISession).userId = String(checkUser._id);

      return res
        .status(200)
        .cookie("aT",token,{maxAge: 1000 * 60 * 60 * 24,httpOnly: true})
        .send({msg: "Login Successful"});
    } else {
      return res.status(200).json({
        user: {
          id: checkUser._id,
          email: checkUser.email,
          name: checkUser.name,
          username: checkUser.username,
        },
        token,
      });
    }
  } catch(error) {
    next(error);
  }
};

export const logout = async (req: Request,res: Response,next: NF) => {
  try {
    res.clearCookie("aT");
    res.clearCookie("session");

    req.session.destroy(() => {
      req.logout((err) => {
        if(err) return next(err);
      });
    });

    return res.status(200).json({msg: "Logged Out"});
  } catch(error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request,res: Response,next: NF) => {
  try {
    const {email} = req.body;

    if(!email) {
      return res.status(400).send({
        error: true,
        msg: "Please provide email",
      });
    }

    const checkUser = await User.findOne({email}).lean().select("email");

    if(!checkUser) {
      return res.status(400).send({
        error: true,
        msg: "Email not found",
      });
    }

    let randomNumber: number = Math.floor(Math.random() * 10000 + 999);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
      <h4>${randomNumber}</h4>
      <br /> 
      <p>Password reset OTP, valid for only 5 minutes</p>
      `,
    });

    const token: string = jwt.sign(
      {num: randomNumber},
      process.env.JWT_KEY as string,
      {
        expiresIn: "5m",
      }
    );

    return res.status(200).send({token,email,msg: "ok"});
  } catch(error) {
    next(error);
  }
};

export const resetPassword = async (req: Request,res: Response,next: NF) => {
  const {token,otp,email,password,confirmPassword} = req.body;

  if(!token || !otp || !email || !password || !confirmPassword) {
    return res.status(400).send({msg: "All fields are necessary"});
  }

  if(password.length < 8) {
    return res.status(400).send({msg: "Password should be atleast 8 char"});
  }

  if(password !== confirmPassword) {
    return res
      .status(400)
      .send({msg: "Passwords don't match with each other"});
  }

  jwt.verify(
    token,
    process.env.JWT_KEY as string,
    async (err: any,user: any) => {
      if(err) return res.status(401).send({msg: "Invalid token"});

      if(String(user.num) !== String(otp)) {
        return res.status(401).send({
          msg: "Wrong OTP",
        });
      } else {
        try {
          const salt: string = await bcrypt.genSalt(10);
          const hashPwd: string = await bcrypt.hash(password,salt);

          await User.findOneAndUpdate(
            {email},
            {$set: {password: hashPwd}},
            {new: true}
          ).lean();

          return res
            .status(200)
            .send({status: "ok",msg: "password Updated Successsfully"});
        } catch(error) {
          next(error);
        }
      }
    }
  );
};
