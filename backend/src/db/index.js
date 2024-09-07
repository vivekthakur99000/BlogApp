import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    console.log(connectionInstance);

    console.log(
      "Database connected successfully",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Failed to connect the db", error);
  }
};

export default connectDB;
