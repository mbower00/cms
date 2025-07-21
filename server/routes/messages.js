const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");
const Contact = require("../models/contact");
var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  Message.find()
    .populate("sender")
    .then((messages) => {
      const responseMessages = messages.map((message) => {
        return {
          _id: message._id,
          id: message.id,
          subject: message.subject,
          msgText: message.msgText,
          sender: message.sender.id,
        };
      });
      res.status(200).json(responseMessages);
    })
    .catch((error) => {
      res.status(500).json({ message: "An error occurred.", error });
    });
});

router.post("/", (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const messagePost = function (contact = null) {
    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: contact ? contact._id : undefined,
    });
    message
      .save()
      .then((createdMessage) => {
        const messageData = {
          _id: createdMessage._id,
          id: createdMessage.id,
          subject: createdMessage.subject,
          msgText: createdMessage.msgText,
          sender: contact ? contact.id : undefined,
        };
        res.status(201).json({
          message: "Message added successfully",
          messageData,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "An error occurred.",
          error,
        });
      });
  };

  if (req.body.sender) {
    Contact.findOne({ id: req.body.sender })
      .then((contact) => {
        messagePost(contact);
      })
      .catch((error) => {
        res.status(500).json({
          message: "Sender not found",
          error: { message: "Sender not found" },
        });
      });
  } else {
    messagePost();
  }
});

router.put("/:id", (req, res, next) => {
  const messagePut = function (contact = null) {
    Message.findOne({ id: req.params.id })
      .then((message) => {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        if (contact) {
          message.sender = contact._id;
        }

        Message.updateOne({ id: req.params.id }, message)
          .then((result) => {
            res.status(204).json({
              message: "Message updated successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "An error occurred",
              error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Message not found",
          error: { message: "Message not found" },
        });
      });
  };

  if (req.body.sender) {
    Contact.findOne({ id: req.body.sender })
      .then((contact) => {
        messagePut(contact);
      })
      .catch((error) => {
        res.status(500).json({
          message: "Sender not found",
          error: { message: "Sender not found" },
        });
      });
  } else {
    messagePut();
  }
});

router.delete("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      Message.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({
            message: "Message deleted successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "An error occurred",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Message not found",
        error: { message: "Message not found" },
      });
    });
});

module.exports = router;
