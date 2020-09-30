const { response } = require('express');
var express = require('express');
var router = express.Router();
const cors = require('cors');
const ws = require("../wslib");

const Joi = require('joi');
const Message = require('../models/message');


router.get('/', function(req, res, next) {
    Message.findAll().then((result) => {
        res.send(result);
    });
});

router.get('/:id', (req, res) =>{
    console.log(req.params);
    Message.findByPk(req.params.id).then((response) => {
        if (response === null)
            return res
            .status(404)
            .send("The message with the given ts was not found.");
        res.send(response);
    });
});

router.post('/', cors(), function(req, res, next){
    const { error } = validateMessage(req.body);

    if(error) return res.status(400).send(error);

    Message.create({message: req.body.message, author: req.body.author, ts: req.body.ts}).then(
        (result)=>{
            res.send(result);
        }
    );
    ws.sendMessages();
});

router.put("/", (req, res) => {
    const {error} = validateMessage(req.body);

    if(error) res.status(404).send(error);

    Message.update(req.body, { where: {ts: req.body.ts } }).then((response) =>{
        if(response[0] !== 0) res.send({message: "Message updated."});
        else res.status(404).send({ message: "Message was not found."})
    });
    ws.sendMessages();
});

router.delete('/:id', (req, res) => {
    Message.destroy({
        where: {
            ts: req.params.id
        },
    }).then((response) => {
        if(response ===1){
            res.status(204).send();
        }
        else res.status(404).send({message: "Client was not found"});
    });
    ws.sendMessages();
});

const validateMessage = (messageR) => {
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]*\s*[a-zA-Z]*$/),
        ts: Joi.number().greater(0)
    });

    return schema.validate(messageR);
};

module.exports = router;