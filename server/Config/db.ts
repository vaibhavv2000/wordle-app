import "dotenv/config";
import {
  connect,
  connection,
  ConnectOptions,
  MongooseError,
  set,
} from "mongoose";

const connectDB = async () => {
  const DB_URL = process.env.MONGODB_URL as string;

  const db = async () => {
    set("strictQuery",false);

    try {
      await connect(DB_URL,{
        useNewUrlParser: true, // allow users to fall back to the old parser if they find a bug in the new parser.

        useUnifiedTopology: true, //Set to true to opt in to using the MongoDB driver's new connection management engine.

        // useCreateIndex option ensures that you are using the new function calls.
      } as ConnectOptions);
    } catch(err: any) {
      console.error(err.message);
      // make the process fail
      process.exit(1);
    }
  };

  db();

  connection.on("error",(err: MongooseError) => {
    console.log(`Mongoose Error --- ${err}`);
    db();
  });

  connection.on("disconnected",() => {
    console.log("Mongoose Disconnected");
    db();
  });

  connection.on("connected",() => {
    console.log("Mongoose Connected");
  });
};

export {connectDB};

/*

When the strict option is set to true, Mongoose will ensure that only the fields that are specified in your schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).

*/