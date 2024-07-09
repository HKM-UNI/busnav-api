import fs from "fs";
import { Feature, GeoJSON, Geometry, LineString, Point } from "typeorm";
import { DbPoint, Route, RoutesResponse } from "../data/route";

function euclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

function nearestPointIndex(lat: number, lon: number, coords: DbPoint[]) {
  let minDistance = Infinity;
  let nearestIndex = -1;

  for (let i = 0; i < coords.length; i++) {
    const distance = euclideanDistance(lat, lon, coords[i].x, coords[i].y);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

function getPathGeometry(a: DbPoint, b: DbPoint, path: DbPoint[]): number[][] {
  const { x: x1, y: y1 } = a;
  const { x: x2, y: y2 } = b;

  let indexNearestToPointA = nearestPointIndex(x1, y1, path);
  let indexNearestToPointB = nearestPointIndex(x2, y2, path);

  const goingBackward = indexNearestToPointB - indexNearestToPointA < 0;

  if (goingBackward) {
    const routeSegment = path
      .slice(indexNearestToPointB, indexNearestToPointA)
      .map((c) => [c.x, c.y]);

    routeSegment.reverse();
    return routeSegment;
  } else {
    return path
      .slice(indexNearestToPointA, indexNearestToPointB)
      .map((c) => [c.x, c.y]);
  }
}

function getRouteData(
  current: number[],
  target: number[],
  resp: RoutesResponse,
  debugGeoJson = false
): Route {
  const pathGeometry = getPathGeometry(
    resp.location_point,
    resp.destination_point,
    resp.route_forward
  );

  if (debugGeoJson) {
    saveGeoJson(current, target, resp, pathGeometry);
  }

  const { x: x1, y: y1 } = resp.location_point;
  const { x: x2, y: y2 } = resp.destination_point;

  return {
    bus_id: resp.bus_id,
    bus_number: resp.bus_number,
    location_coordinates: current,
    destination_coordinates: target,
    nearest_stop_at_location: {
      name: resp.location_stop_name ?? "",
      coordinates: [x1, y1],
    },
    nearest_stop_at_destination: {
      name: resp.destination_stop_name ?? "",
      coordinates: [x2, y2],
    },
    route_path: pathGeometry,
  };
}

function saveGeoJson(
  current: number[],
  target: number[],
  resp: RoutesResponse,
  path: number[][]
) {
  const pathRemapped = path.map((c) => [c[1], c[0]]);

  const linestring: Feature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: pathRemapped,
    },
    properties: {
      name: resp.bus_number.toString(),
    },
  };

  const currentLocation: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [current[1], current[0]],
    },
    properties: {
      name: "Current Location",
    },
  };

  const targetLocation: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [target[1], target[0]],
    },
    properties: {
      name: "Target Location",
    },
  };

  const { x: x1, y: y1 } = resp.location_point;
  const startPoint: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [y1, x1],
    },
    properties: {
      name: resp.location_stop_name,
    },
  };

  const { x: x2, y: y2 } = resp.destination_point;
  const endPoint: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [y2, x2],
    },
    properties: {
      name: resp.destination_stop_name,
    },
  };

  const geoData: GeoJSON = {
    type: "FeatureCollection",
    features: [
      linestring,
      currentLocation,
      targetLocation,
      startPoint,
      endPoint,
    ],
  };

  fs.writeFile("data.geojson", JSON.stringify(geoData), (err) => {
    if (err) throw err;
  });
}

export { getRouteData };
