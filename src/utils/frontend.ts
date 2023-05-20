import express from "express";
import log from "./logger";

const app = express();

export function startFrontendServer() {
  // server static files for /frontend/build/index.html
  app.use('/assets', express.static('frontend/build/assets'));
 
  app.get("/", async (req, res) => {
    res.sendFile("index.html", { root: "./frontend/build" });
  });

  app.listen(3000, () => {
    log.info("Launch Frontend on http://localhost:3000");
  });
}
