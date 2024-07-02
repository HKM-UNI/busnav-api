import express from "express";

const routes_router = express.Router();

routes_router.get("", async (req, res) => {
  const response = {
    hello: "world",
  };

  res.json(response);
});

export { routes_router };
