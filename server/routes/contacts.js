const sequenceGenerator = require('./sequenceGenerator')
const Contact = require('../models/contact')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res, next) => {
    let data
    try {
        data = await Contact.find().populate('group')
    } catch (error) {
        res.status(500).json(error)
    }
    res.status(200).json(data)
})

router.post('/', async (req, res, next) => {
    const maxContactId = await sequenceGenerator.nextid("contacts")

    let group = req.body.group
    if (group) {
        try {
            group = group.map(async (contact) => {
                let data = await Contact.findOne({ id: contact.id })
                return data._id
            })
        } catch (error) {
            res.status(500).json({ message: 'Could not find group member(s).' }, error)
        }
    }

    const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: group,
    })

    let createdContact
    try {
        createdContact = await contact.save()
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(201).json({ message: 'Contact added sucessfully', data: createdContact })
})

router.put('/:id', async (req, res, next) => {
    let contact
    try {
        contact = await Contact.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Contact not found.',
            error
        })
    }

    let group = req.body.group
    if (group) {
        try {
            const newGroup = []
            for (let i of group) {
                let data = await Contact.findOne({ id: i.id })
                newGroup.push(data._id)
            }
            group = [...newGroup]
            console.log(group)
        } catch (error) {
            res.status(500).json({ message: 'Could not find group member(s).' }, error)
        }
    }

    contact.name = req.body.name
    contact.email = req.body.email
    contact.phone = req.body.phone
    contact.imageUrl = req.body.imageUrl
    contact.group = group
    try {
        await Contact.updateOne({ id: req.params.id }, contact)
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: 'Contact updated successfully'
    })
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Contact.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Contact not found.',
            error
        })
    }
    try {
        await Contact.deleteOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: "Contact deleted successfully"
    })
})

module.exports = router