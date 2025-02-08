import express, { Express } from "express";

import { appSetup, routerSetup, securitySetup, swaggerSetup } from "./startup";

const app: Express = express();

securitySetup(app);
routerSetup(app);
swaggerSetup(app);
appSetup(app);
