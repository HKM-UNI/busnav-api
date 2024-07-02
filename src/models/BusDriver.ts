import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bus } from "./Bus";

@Entity({ name: "bus_driver" })
export class BusDriver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 32 })
  name!: string;

  @ManyToMany(() => BusDriver)
  @JoinTable({
    name: "bus_drivers", // Custom join table name
    joinColumn: { name: "driver_id" }, // Custom foreign key column name for this entity
    inverseJoinColumn: { name: "bus_id" }, // Custom foreign key column name for the related entity
  })
  buses!: Bus[];
}
