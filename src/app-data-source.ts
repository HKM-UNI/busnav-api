import { config } from "dotenv";
import { DataSource } from "typeorm";
import * as e from "./models";

config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [e.Bus, e.BusCooperative, e.BusDriver, e.BusPath, e.BusStop],
  synchronize: !!process.env.TORM_SYNC || false,
  logging: !!process.env.TORM_LOGGING || false,
  legacySpatialSupport: false
});

export default dataSource;
