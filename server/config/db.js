import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("======================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📂 Database : ${conn.connection.name}`);
    console.log(`🖥️ Host      : ${conn.connection.host}`);
    console.log("======================================");
    return conn;
  } catch (error) {
    console.error("======================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("======================================");
  }
};

export default connectDB;