const { ObjectID } = require("mongodb");
const mdbconn = require("../lib/utils/mongo.js");

const getMessages = () => {
  return mdbconn.conn().then((client) => {
    return client.db("chat").collection("messages").find({}).toArray();
  });
};

const getMessage = (id) => {
  return mdbconn.conn().then((client) => {
    return client
      .db("chat")
      .collection("messages")
      .findOne({ _id: new ObjectID(id) });
  }).catch((error) => {
    return error;
  });
};

const insertMessage = (message) => {
  console.log(message);
  return mdbconn.conn().then((client) => {
    return client.db("chat").collection("messages").insertOne(message);
  });
};

const deleteMessage = (id) => {
  return mdbconn.conn().then((client) => {
    return client
      .db("chat")
      .collection("messages")
      .deleteOne({ _id: new ObjectID(id) });
  });
};

const updateMessage = (newMessage) => {
  return mdbconn.conn().then((client) => {
    client
      .db("chat")
      .collection("messages")
      .updateOne(
        { _id: new ObjectID(newMessage._id) },
        {
          $set: {
            message: newMessage.message,
            author: newMessage.author,
            ts: newMessage.ts,
          },
        }
      );
  });
};

exports.getMessages = getMessages;
exports.insertMessage = insertMessage;
exports.deleteMessage = deleteMessage;
exports.getMessage = getMessage;
exports.updateMessage = updateMessage;
