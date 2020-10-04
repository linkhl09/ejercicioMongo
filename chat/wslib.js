const WebSocket = require("ws");
let db = require("./controllers/message");

const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", () => {
      sendMessages();
    });
  });
};

const sendMessages = () => {
  db.getMessages().then((result) => {
    clients.forEach((client) => client.send(JSON.stringify(result)));
  });
};


exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;