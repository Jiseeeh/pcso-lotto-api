import express, { Express } from "express";

import { appSetup, routerSetup, securitySetup } from "./startup";

const app: Express = express();

securitySetup(app);
routerSetup(app);
appSetup(app)
