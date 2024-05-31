import mongoose from "mongoose";
import dbConnection from "./src/db/db-connection.js";

beforeEach(async () => {
  await dbConnection();
  // clean all collections
  await Promise.all(
    Object.values(mongoose.connection.collections).map(async (collection) => {
      collection.deleteMany({});
    }),
  );
});
