import dbConnection from "./src/db/db-connection.js";
import { app } from "./routes.js";

const { PORT } = process.env;

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    console.error(error);
    console.log("UNABLE TO CONNECT TO DATABASE");
  });
