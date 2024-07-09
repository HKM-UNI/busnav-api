import busData from "./112.1.json";
import dataSource from "./app-data-source";
import { BusPath, BusStop } from "./models";
import { LineString, Point } from "typeorm";

importBusData(2, busData, true);

async function importBusData(
  busId: number,
  data: typeof busData,
  backward: boolean
) {
  await dataSource.initialize();

  const createPath = async () => {
    const busPathRepo = dataSource.getRepository(BusPath);
    const { geometry: geo } = data.features[0];

    const newPath = busPathRepo.create({
      busId: busId,
      backward: backward,
    });

    const newGeometry = {
      type: "LineString",
      coordinates:
        geo.type == "LineString" ? geo.coordinates : geo.coordinates.flat(),
    };

    newPath.path = reversePathCoordinates(newGeometry as LineString);

    await busPathRepo.save(newPath);
  };

  const createStops = async () => {
    const busStopRepo = dataSource.getRepository(BusStop);
    const geojsonFeatures = data.features.slice(1);

    const newBusStops = geojsonFeatures.map((feature) => {
      const newStop = busStopRepo.create({
        busId: busId,
        name: feature.properties.name ?? undefined,
      });
      newStop.location = reversePointCoordinates(feature.geometry as Point);

      return newStop;
    });

    await busStopRepo.save(newBusStops);
  };

  await createPath();
  await createStops();

  await dataSource.destroy();
}

function reversePathCoordinates(lstr: LineString): LineString {
  lstr.coordinates.every((c) => c.reverse());
  return lstr;
}

function reversePointCoordinates(p: Point): Point {
  p.coordinates.reverse();
  return p;
}
