// using code from:
// - https://mongoosejs.com/docs/subdocs.html
// - ./google_ai_source.png
// - ./google_ai_source_2.png
// - https://mongoosejs.com/docs/8.x/docs/api/schema.html#Schema.prototype.add()

const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
})

documentSchema.add({ children: [documentSchema] })

module.exports = mongoose.model('Document', documentSchema)