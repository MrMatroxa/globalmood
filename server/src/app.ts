import dotenv from "dotenv";
dotenv.config();

import express from "express";
import prisma from "./db/index";
import configureApp from "./config";
import indexRoutes from "./routes/index.routes";
import handleErrors from "./error-handling";

const app = express();

configureApp(app);

app.use("/api", indexRoutes);

handleErrors(app);

export default app;