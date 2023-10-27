import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import "dotenv/config";
import User,{I_User} from "../Models/User";
import Game from "../Models/Game";
import {connection} from "mongoose";

const PORT = process.env.PORT || 3000;

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `http://localhost:${PORT}/auth/google/callback`,
  },
    async function(accessToken,refreshToken,profile,cb) {
      // console.log(profile);
      const session = await connection.startSession();

      try {
        const userExists = await User.findOne({email: profile._json.email});
        if(userExists) {
          return cb(null,userExists);
        } else {
          await session.startTransaction();
          const user = new User({
            email: profile._json.email,
            name: profile.displayName,
            username: profile.displayName + "gd83cgfef",
            password: "suchb7gcc",
          });

          const game = new Game({
            userId: user._id,
          });

          const newUser = await user.save();
          await game.save();
          cb(null,newUser);
        }

        await session.commitTransaction()
      } catch(error) {
        console.log({error});
        await session.abortTransaction();
      }
    }
  )
);

passport.serializeUser(function(user,cb) {
  cb(null,user);
});

passport.deserializeUser(function(user: any,cb) {
  // User.findById(user.id, (err: any, payload: any) => {
  //   cb(err, payload);
  // });

  cb(null,user);
});
