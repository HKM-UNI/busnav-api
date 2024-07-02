import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bus } from "./Bus";
import { wktToGeoJSON, geojsonToWKT } from "@terraformer/wkt";
import { MultiLineString } from "typeorm";

@Entity({ name: "bus_path" })
export class BusPath {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Bus, (bus) => bus.paths)
  @JoinColumn({ name: "bus_id" })
  bus!: Bus;

  @Column({ name: "path", type: "multilinestring", nullable: false })
  _path!: string;

  @Column({ type: "bit", default: false })
  backward!: boolean;

  get path(): MultiLineString {
    const data = wktToGeoJSON(this._path);
    return data as MultiLineString;
  }

  set path(value: MultiLineString) {
    const wktData = geojsonToWKT(value);
    this._path = wktData;
  }
}
