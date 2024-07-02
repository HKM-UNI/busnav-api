import express from "express";
import dataSource from "../app-data-source";
import { Bus } from "../models";

const buses_router = express.Router();

const mock_geo_jsons: { [key: number]: { forward: string; backward: string } } =
  {
    110: {
      forward:
        "https://raw.githubusercontent.com/HKM-UNI/busnav-db/main/mock/110.1.geojson",
      backward:
        "https://raw.githubusercontent.com/HKM-UNI/busnav-db/main/mock/110.2.geojson",
    },
    112: {
      forward:
        "https://raw.githubusercontent.com/HKM-UNI/busnav-db/main/mock/112.1.geojson",
      backward:
        "https://raw.githubusercontent.com/HKM-UNI/busnav-db/main/mock/112.2.geojson",
    },
  };

buses_router.get("", async (req, res) => {
  const buses = await dataSource
    .getRepository(Bus)
    .createQueryBuilder("b")
    .innerJoinAndSelect("b.drivers", "bd")
    .innerJoinAndSelect("b.cooperative", "bc")
    .innerJoinAndSelect("b.startTerminal", "st")
    .innerJoinAndSelect("b.endTerminal", "et")
    .getMany();

  const response_data = [
    buses.map((b) => ({
      id: b.id,
      name: `Ruta ${b.number}`,
      number: b.number,
      cooperative: b.cooperative.name,
      owners: b.drivers.map((d) => d.name),
      terminal1: b.startTerminal.toFrontendModel(),
      terminal2: b.endTerminal.toFrontendModel(),
      geojson_terminal1_to_terminal2: mock_geo_jsons[b.number].forward,
      geojson_terminal2_to_terminal1: mock_geo_jsons[b.number].backward,
    })),
  ];

  const response = {
    ok: true,
    code: 200,
    message: "ok",
    data: response_data,
  };

  res.json(response);
});

export { buses_router };
