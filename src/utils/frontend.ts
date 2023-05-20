import express, { Express, Request, Response } from "express";

export function startFrontendServer(app: Express) {
  // server static files for /frontend/build/index.html
  app.use('/assets', express.static('frontend/build/assets'));
 
  app.get("/", async (req, res) => {
    res.sendFile("index.html", { root: "./frontend/build" });
  });
}
