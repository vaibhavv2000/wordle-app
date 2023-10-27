import {model,Schema,HydratedDocument} from "mongoose";

interface user {
  username: string;
  name: string;
  password: string;
  email: string;
  profile: string;
  cover: string;
};

export type I_User = HydratedDocument<user & {_id: Schema.Types.ObjectId}>;

const userSchema = new Schema<user>({
  username: {
    type: String,
    min: 3,
    max: 30,
    unique: true,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    min: 3,
    max: 200,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    min: 8,
    max: 30,
    trim: true,
    required: true,
  },
  profile: {type: String,default: ""},
  cover: {type: String,default: ""},
},{
  timestamps: true,
});

const User = model<user>("User",userSchema);

export default User;
