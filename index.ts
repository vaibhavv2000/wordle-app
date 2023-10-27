import express,{Application,NextFunction,Request,Response} from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import path from "path";
import {connectDB} from "./server/Config/db";
import {API} from "./server/Routes/API/API";
import {redisStore} from "./server/Config/redis";
import {WebRouter} from "./server/Routes/Web/WebRoutes";
import {passportRouter} from "./server/Routes/API/PassportAuth";
import "./server/Config/passport";
const PORT = (Number(process.env.PORT) as number) || 3000;

const app: Application = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  session({
    name: "session",
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_KEY as string,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: false, // true for HTTPS & false for HTTP
      httpOnly: true, // Can't be accessed on client side
    },
  })
);
app.use(cors({credentials: true,}));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'","https: data:"],
      "connect-src": ["*","ws"],
    },
  })
);
app.use(morgan("tiny"));

// passport
app.use(passport.initialize());
app.use(passport.session());

// assets
app.set("view engine","ejs");
app.set("views",path.join(process.cwd(),"./client/html"));
app.use(express.static(path.join(process.cwd(),"./client/dist")));

// routes
app.use(WebRouter);
app.use(passportRouter);
app.use("/api",API);
// app.get("*",(_,res: Response) => {
//   return res.status(404).render("notFound");
// });

// error Handler
app.use((err: Error,req: Request,res: Response,next: NextFunction) => {
  res.status(500).json({
    msg: err.message,
  });
});

app.listen(PORT,() =>
  console.log(`Server running at http://localhost:${PORT}`)
);