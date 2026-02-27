import { config } from "./server/config.ts";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { initDb } from "./server/db.ts";
import authRoutes from "./server/routes/auth.ts";
import sosRoutes from "./server/routes/sos.ts";
import { setupSockets } from "./server/sockets/index.ts";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  app.use(cors());
  app.use(express.json());

  // Initialize Database
  initDb();

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/sos", sosRoutes);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Setup WebSockets
  setupSockets(io);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(Number(config.PORT), "0.0.0.0", () => {
    console.log(`NearHelp server running on http://localhost:${config.PORT}`);
  });
}

startServer();
