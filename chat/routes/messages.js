const { response } = require("express");
var express = require("express");
var router = express.Router();
const cors = require("cors");
const ws = require("../wslib");

const Joi = require("joi");
let db = require("../controllers/message");

router.get("/", function (req, res, next) {
  db.getMessages().then((messages) => res.send(messages));
});

router.get("/:id", (req, res) => {
  db.getMessage(req.params.id)
    .then((response) => {
      if (response === null)
        return res
          .status(404)
          .send("The message with the given id was not found.");
      console.log(response);
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.post("/", cors(), function (req, res, next) {
  const { error } = validateMessage(req.body);

  if (error) return res.status(400).send(error);

  db.insertMessage(req.body).then((newProduct) => res.send(newProduct.ops));
  ws.sendMessages();
});

router.put("/", (req, res) => {
  const { error } = validateMessage(req.body);

  if (error) res.status(404).send(error);
  else {
    db.updateMessage(req.body)
      .then((response) => {
        res.send({ message: "Message updated" });
      })
      .catch((error) => {
        res.status(404).send({ message: "Message was not found." });
      });
    ws.sendMessages();
  }
});

router.delete("/:id", (req, res) => {
  db.deleteMessage(req.params.id).then((response) => {
    if (response.deletedCount === 1) res.status(204).send();
    else res.status(404).send({ message: "Message was not found" });
  });
  ws.sendMessages();
});

const validateMessage = (messageR) => {
  const schema = Joi.object({
    _id: Joi.string(),
    message: Joi.string().min(5).required(),
    author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]*\s*[a-zA-Z]*$/),
    ts: Joi.number().greater(0),
  });

  return schema.validate(messageR);
};

module.exports = router;
