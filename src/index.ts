import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const port = process.env.PORT || 4000;
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/buses", async (req, res) => {
  const buses = await prisma.bus.findMany({
    include: {
      bus_drivers: {
        select: {
          bus_driver: {
            select: {
              name: true,
            },
          },
        },
      },
      bus_stop_bus_start_terminalTobus_stop: true,
      bus_stop_bus_end_terminalTobus_stop: true,
      cooperative_buses: {
        select: {
          bus_cooperative: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const response = {
    buses: [
      buses.map((b) => ({
        id: b.id,
        name: `Ruta ${b.number}`,
        number: b.number,
        cooperative: b.cooperative_buses[0].bus_cooperative.name,
        owners: b.bus_drivers.map((d) => d.bus_driver.name),
        terminal1: b.bus_stop_bus_start_terminalTobus_stop,
        terminal2: b.bus_stop_bus_end_terminalTobus_stop,
        geojson_terminal1_to_terminal2: b.route_forward_data_url,
        geojson_terminal2_to_terminal1: b.route_backward_data_url,
      })),
    ],
  };
  res.json(response);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
