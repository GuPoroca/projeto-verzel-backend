import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import filmRoutes from "./routes/films.router.mjs";
import userRoutes from "./routes/user.router.mjs";
import authMiddleware from "./middlewares/auth.middleware.mjs";
import fallbackMiddleware from "./middlewares/fallback.middleware.mjs";

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));
server.use(express.json());
server.use(userRoutes);
server.use(authMiddleware, filmRoutes);
server.use(fallbackMiddleware);

server.use("*", (request, response) => {
  response.status(404).send({ message: "Route not found" });
});

server.listen(PORT, () => {
    console.log(`Estou rodando na porta ${PORT}`);
});