import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BusCooperative } from "./BusCooperative";
import { BusDriver } from "./BusDriver";
import { BusPath } from "./BusPath";
import { BusStop } from "./BusStop";

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "smallint", unique: true })
  number!: number;

  @Column({
    name: "average_time_minutes",
    type: "tinyint",
    unsigned: true,
    nullable: true,
  })
  averageTimeMinutes!: number;

  @ManyToOne(() => BusCooperative, (c) => c.buses, { onDelete: "SET NULL" })
  @JoinColumn({ name: "cooperative_id" })
  cooperative!: BusCooperative;

  @ManyToOne(() => BusStop, { onDelete: "SET NULL" })
  @JoinColumn({ name: "start_terminal" })
  startTerminal!: BusStop;

  @ManyToOne(() => BusStop, { onDelete: "SET NULL" })
  @JoinColumn({ name: "end_terminal" })
  endTerminal!: BusStop;

  @OneToMany(() => BusPath, (busPath) => busPath.bus, { cascade: true })
  paths!: BusPath[];

  @ManyToMany(() => BusDriver)
  @JoinTable({
    name: "bus_drivers", // Custom join table name
    joinColumn: { name: "bus_id" }, // Custom foreign key column name for this entity
    inverseJoinColumn: { name: "driver_id" }, // Custom foreign key column name for the related entity
  })
  drivers!: BusDriver[];
}
