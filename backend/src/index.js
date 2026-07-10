import express from "express";
import cors from "cors";
import "dotenv/config";

import casesRouter from "./routes/cases.js";
import conciergeRouter from "./routes/concierge.js";
import trainingRouter from "./routes/training.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "bayanihan-collective-backend" });
});

app.use("/api/cases", casesRouter);
app.use("/api/concierge", conciergeRouter);
app.use("/api/training", trainingRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Bayanihan Collective backend listening on port ${PORT}`);
});
