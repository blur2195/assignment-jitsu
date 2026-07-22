const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "mockData", "shipments.json");

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });

module.exports = function mockDbProxy(app) {
  app.get("/mock/db", (_req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/mock/persist", async (req, res) => {
    try {
      const data = await readBody(req);
      fs.writeFileSync(DB_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });
};
