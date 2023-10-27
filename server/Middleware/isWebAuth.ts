import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { ISession } from "../Controllers/AuthController";

type NF = NextFunction;

const isWebAuth = (req: Request, res: Response, next: NF) => {
  const session = req.session as ISession;
  const cookie = req.cookies.aT;

  jwt.verify(
    cookie,
    process.env.JWT_KEY as string,
    (err: any, user: JwtPayload | any) => {
      if (err) {
        res.status(301).redirect("/");
        return;
      }

      if (String(user.id) !== String(session.userId)) {
        return res.status(301).redirect("/");
      }

      res.locals.id = user.id;
      res.locals.username = user.username;

      next();
    }
  );
};

const isAlreadyAuth = (req: Request, res: Response, next: NF) => {
  const session = req.session as ISession;
  const cookie = req.cookies.aT;

  if (session.userId && cookie) {
    return res.status(301).redirect("/wordle");
  }

  next();
};

export { isWebAuth, isAlreadyAuth };
