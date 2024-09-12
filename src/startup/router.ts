import { Express, Request, Response } from "express";

export const routerSetup = (app: Express) =>
  app.get("/", async (req: Request, res: Response) => {
    res.send("HEY");
  });
