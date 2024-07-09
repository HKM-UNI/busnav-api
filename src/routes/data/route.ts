export type RoutesRequest = {
  location: number[];
  destination: number[];
};

export type RoutesResponse = {
  bus_id: number;
  bus_number: number;
  location_stop_name: string;
  location_point: DbPoint;
  destination_stop_name: string;
  destination_point: DbPoint;
  route_forward: DbPoint[];
  route_backward: DbPoint[];
};

export type DbPoint = {
  x: number;
  y: number;
};

export type RouteStop = {
  name: string;
  coordinates: number[];
};

export type Route = {
  bus_id: number;
  bus_number: number;
  location_coordinates: number[];
  destination_coordinates: number[];
  nearest_stop_at_location: RouteStop;
  nearest_stop_at_destination: RouteStop;
  route_path: number[][];
};
