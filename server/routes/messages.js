const sequenceGenerator = require('./sequenceGenerator')
const Message = require('../models/message')
const Contact = require('../models/contact')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res, next) => {
    let data
    try {
        data = await Message.find().populate('sender')
    } catch (error) {
        res.status(500).json(error)
    }
    data = data.map((msg) => {
        return {
            id: msg.id,
            subject: msg.subject,
            msgText: msg.msgText,
            sender: msg.sender?.id
        }
    })
    res.status(200).json(data)
})

router.post('/', async (req, res, next) => {
    const maxMessageId = await sequenceGenerator.nextid("messages")

    let sender = null
    if (req.body.sender) {
        try {
            sender = await Contact.findOne({ id: req.body.sender })
        } catch (error) {
            res.status(500).json({ message: 'Could not find sender', error })
        }
    }

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: sender?._id
    })

    let createdMessage
    try {
        createdMessage = await message.save()
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    createdMessage = {
        id: createdMessage.id,
        subject: createdMessage.subject,
        msgText: createdMessage.msgText,
        sender: sender?.id
    }
    res.status(201).json({ message: 'Message added sucessfully', data: createdMessage })
})

router.put('/:id', async (req, res, next) => {
    let message
    try {
        message = await Message.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Message not found.',
            error
        })
    }

    let sender = null
    if (req.body.sender) {
        try {
            const contact = await Contact.findOne({ id: req.body.sender })
            sender = contact
        } catch (error) {
            res.status(500).json({ message: 'Could not find sender', error })
        }
    }

    message.subject = req.body.subject
    message.msgText = req.body.msgText
    message.sender = sender?._id

    try {
        await Message.updateOne({ id: req.params.id }, message)
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: 'Message updated successfully'
    })
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Message.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Message not found.',
            error
        })
    }
    try {
        await Message.deleteOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: "Message deleted successfully"
    })
})

module.exports = router