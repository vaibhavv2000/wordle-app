import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { ISession } from "../Controllers/AuthController";

type NF = NextFunction;

const isAuth = (req: Request, res: Response, next: NF) => {
  const session = req.session as ISession;
  const cookie = req.cookies.aT;
  const token: any = req.headers.authorization?.split(" ")[1];

  console.log(token);

  if (session && cookie) {
    jwt.verify(
      cookie,
      process.env.JWT_KEY as string,
      (err: any, user: JwtPayload | any) => {
        if (err) {
          console.log(err);
          return res.status(401).send("Unauthorized");
        }

        if (String(user.id) !== String(session.userId)) {
          return res.status(401).send("Invalid user");
        }

        res.locals.id = user.id;
        res.locals.username = user.username;

        next();
      }
    );
  } else if (token) {
    jwt.verify(
      token,
      process.env.JWT_KEY as string,
      (err: any, user: JwtPayload | any) => {
        if (err) {
          console.log(err);
          return res.status(401).send("Unauthorized");
        }

        res.locals.id = user.id;
        res.locals.username = user.username;

        next();
      }
    );
  } else {
    return res.status(401).send("User Unauthorized");
  }
};

export { isAuth };
