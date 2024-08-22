import express from "express";

const PORT = process.env.PORT || 5000;

const server = express();
server.use(express.json());

server.use("*", (request, response) => {
  response.status(404).send({ message: "Route not found" });
});

server.listen(PORT, () => {
    console.log(`Estou rodando na porta ${PORT}`);
});