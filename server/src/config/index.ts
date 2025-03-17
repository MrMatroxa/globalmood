import express, { Express } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

export default (app: Express): void => {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: [FRONTEND_URL]
    })
  );

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};