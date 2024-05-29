import mongoose from "mongoose";
import dbConnection from "./src/db/db-connection.js";
// import { afterEach } from "@jest/globals";

export const setup = async () => {
  await dbConnection();
};

// Clean up the database after each test case

export const teardown = async () => {
  await mongoose.connection.close();
  await Promise.all(
    Object.values(mongoose.connection.collections).map(async (collection) =>
      collection.deleteMany({}),
    ),
  );
};
