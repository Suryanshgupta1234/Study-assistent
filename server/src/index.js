import "dotenv/config";
import express from "express";
import cors from "cors";
import generateRouter from "./routes/generate.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`Study assistant API listening on port ${PORT}`);
});
