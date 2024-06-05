import mongoose from "mongoose";

export default async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });
  } catch (error) {
    console.log("Database connection failed", error);
  }
}
