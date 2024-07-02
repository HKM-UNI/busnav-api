import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { wktToGeoJSON, geojsonToWKT } from "@terraformer/wkt";
import { Point } from "typeorm";

type BusStopFrontend = {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
}

@Entity({ name: "bus_stop" })
export class BusStop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 32 })
  name!: string;

  @Column({ name: "location", type: "point", nullable: false })
  _location!: string;

  get location(): Point {
    const data = wktToGeoJSON(this._location);
    return data as Point;
  }

  set location(value: Point) {
    const wktData = geojsonToWKT(value);
    this._location = wktData;
  }

  toFrontendModel(): BusStopFrontend {
    return {
      id: this.id,
      name: this.name,
      latitude: this.location.coordinates[0],
      longitude: this.location.coordinates[1],
    }
  }
}
