import express from "express";
import db from "./database";
import errorHanddlerMiddleware from "./middlewares/error-handdles.middleware";
import jwtAuthenticationMiddleware from "./middlewares/jwt-authentication.middleware";
import authenticationRoute from "./routes/authentication.route";
import statusRoute from "./routes/status.route";
import usersRoute from "./routes/users.route";

const app = express();

// Configurações da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurações de rotas
app.use(statusRoute);
app.use("/authenticate", authenticationRoute);
app.use("/users", jwtAuthenticationMiddleware, usersRoute);

app.use(errorHanddlerMiddleware);

// Inicialização do servidor
const server = app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000`);
});

process.on("SIGTERM", () => {
  db.end(() => {
    console.log("database connection closed!");
  });
  server.close(() => {
    console.log("server on 3000 closed!");
  });
});
