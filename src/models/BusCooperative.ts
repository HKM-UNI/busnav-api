import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable } from "typeorm";
import { Bus } from "./Bus";

@Entity({ name: "bus_cooperative" })
export class BusCooperative {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  name!: string;

  @Column({ length: 150, nullable: true })
  description!: string;

  @OneToMany(() => Bus, (bus) => bus.cooperative, { cascade: true })
  buses!: Bus[]
}
