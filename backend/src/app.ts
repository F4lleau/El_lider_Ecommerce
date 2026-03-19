import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI
const swaggerPath = path.join(process.cwd(), "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Backend ecommerce funcionando",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "API operativa",
  });
});

app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
