import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { app } from "./app.js";

// ...existing code...

const swaggerPath = path.join(process.cwd(), "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ...existing code...
