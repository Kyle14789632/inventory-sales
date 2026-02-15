import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// must be LAST
app.use(errorHandler);

export default app;
