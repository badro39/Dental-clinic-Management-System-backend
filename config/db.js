import {connect} from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB connection error:");
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
