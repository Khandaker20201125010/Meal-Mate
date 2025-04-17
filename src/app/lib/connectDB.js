import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  try {
    const conn = await mongoose.connect(process.env.NEXT_MONGODB_URI, {
      dbName: "MealMate",
    });
    console.log("Connected to MongoDB:", conn.connection.name); // → “MealMate”
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
