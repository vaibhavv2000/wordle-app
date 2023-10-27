import { NextFunction, Request, Response } from "express";
import { words } from "../Config/words";
import Game from "../Models/Game";

type NF = NextFunction;

export const getWord = async (req: Request, res: Response, next: NF) => {
  try {
    const word: string = words[Math.floor(Math.random() * words.length)];

    return res.status(200).json({ msg: word });
  } catch (error) {
    next(error);
  }
};

export const newGame = async (req: Request, res: Response, next: NF) => {
  const { id } = res.locals;

  try {
    const game = await Game.updateOne(
      { userId: id },
      {
        $inc: { totalMatches: 1 },
      }
    );

    return res.status(201).send({ msg: "Total count updated" });
  } catch (error) {
    next(error);
  }
};

export const gameWon = async (req: Request, res: Response, next: NF) => {
  const { id } = res.locals;

  try {
    const game = await Game.updateOne(
      { userId: id },
      {
        $inc: { won: 1 },
      }
    );

    return res.status(200).send({ msg: "Win count added" });
  } catch (error) {
    next(error);
  }
};
