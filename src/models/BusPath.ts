import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bus } from "./Bus";
import { wktToGeoJSON, geojsonToWKT } from "@terraformer/wkt";
import { LineString } from "typeorm";

@Entity({ name: "bus_path" })
export class BusPath {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "bus_id", type: "int" })
  busId!: number;

  @ManyToOne(() => Bus, (bus) => bus.paths)
  @JoinColumn({ name: "bus_id" })
  bus!: Bus;

  @Column({ name: "path", type: "linestring", nullable: false })
  private _path!: string;

  @Column({ type: "bit", default: false })
  backward!: boolean;

  get path(): LineString {
    const data = wktToGeoJSON(this._path);
    return data as LineString;
  }

  set path(value: LineString) {
    const wktData = geojsonToWKT(value);
    this._path = wktData;
  }
}
