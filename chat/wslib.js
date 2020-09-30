const WebSocket = require("ws");
const Message = require('./models/message');

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
  Message.findAll().then((result) =>{
    clients.forEach((client) => client.send(JSON.stringify(result)));
  }).catch((err) => console.log(err));
};


exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;