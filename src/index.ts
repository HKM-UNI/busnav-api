import "reflect-metadata";

import cors from "cors";
import express from "express";
import datasource from "./app-data-source";
import { buses_router, routes_router } from "./routes";

datasource
  .initialize()
  .then(() => {
    const port = process.env.PORT || 4000;
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use("/buses", buses_router);
    app.use("/routes", routes_router);

    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
