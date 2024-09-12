import express, { Express } from "express";
import cors from "cors";

export const securitySetup = (app: Express) =>
  app.use(cors()).use(express.json());
