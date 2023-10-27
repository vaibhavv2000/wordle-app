import {HydratedDocument,model,Schema} from "mongoose";

interface game {
  userId: Schema.Types.ObjectId;
  totalMatches: number;
  won: number;
};

export type I_Game = HydratedDocument<game & {_id: Schema.Types.ObjectId}>;

const gameSchema = new Schema<I_Game>({
  userId: {type: Schema.Types.ObjectId,required: true},
  totalMatches: {type: Number,default: 0},
  won: {type: Number,default: 0},
});

const Game = model<game>("game",gameSchema);

export default Game;
