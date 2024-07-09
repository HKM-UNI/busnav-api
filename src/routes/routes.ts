import express from "express";
import dataSource from "../app-data-source";
import { RoutesRequest, RoutesResponse } from "./data/route";
import { getRouteData } from "./helpers";

const routesRouter = express.Router();

routesRouter.post("", async (req, res) => {
  const { location, destination } = req.body as RoutesRequest;

  const response = {
    ok: true,
    code: 200,
    message: "ok",
    data: {},
  };

  try {
    const queryStr =
      "CALL sp_nearest_single_bus_route(ST_GeomFromText('POINT(? ?)', 4326), ST_GeomFromText('POINT(? ?)', 4326))";
    const result = await dataSource.manager.query(queryStr, [
      ...location,
      ...destination,
    ]);

    const procedureData = result[0][0] as RoutesResponse;

    if (!procedureData) {
      response.ok = false;
      response.code = 500;
      response.message = result[1].info;
    }

    response.data = getRouteData(
      location,
      destination,
      procedureData,
      true
    );
  } catch (error) {
    response.ok = false;
    response.code = 500;
    response.message = (error as object)?.toString() || "Unknown Error";
  }

  res.json(response);
});

export { routesRouter as routes_router };
