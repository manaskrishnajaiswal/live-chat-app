import mongoose from "mongoose";
mongoose.set("strictQuery", true);
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
