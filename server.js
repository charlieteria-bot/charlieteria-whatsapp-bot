const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const VERIFY_TOKEN = "charlieteria_token";

// Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    console.log("Mensaje recibido");
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot funcionando en puerto 3000");
});
