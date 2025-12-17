const sequenceGenerator = require('./sequenceGenerator')
const Document = require('../models/document')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res, next) => {
    let data
    try {
        data = await Document.find()
    } catch (error) {
        res.status(500).json(error)
    }
    res.status(200).json(data)
})

router.post('/', async (req, res, next) => {
    const maxDocumentId = await sequenceGenerator.nextid("documents")

    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    })

    let createdDocument
    try {
        createdDocument = await document.save()
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(201).json({ message: 'Document added sucessfully', data: createdDocument })
})

router.put('/:id', async (req, res, next) => {
    let document
    try {
        document = await Document.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Document not found.',
            error
        })
    }
    document.name = req.body.name
    document.description = req.body.description
    document.url = req.body.url
    try {
        await Document.updateOne({ id: req.params.id }, document)
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: 'Document updated successfully'
    })
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Document.findOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'Document not found.',
            error
        })
    }
    try {
        await Document.deleteOne({ id: req.params.id })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error
        })
    }
    res.status(204).json({
        message: "Document deleted successfully"
    })
})

module.exports = router