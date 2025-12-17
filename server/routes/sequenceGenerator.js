// using code from Jeremy Troy Suchanski's comment on W11 Developer Forum

var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

class SequenceGenerator {
  constructor() {
    Sequence.findOne().then((sequence) => {
      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
    }).catch((err) => {
      console.error({
        title: 'An error occurred',
        error: err
      })
    })
  }

  async nextid(collectionType) {
    var updateObject = {};
    var nextId;

    switch (collectionType) {
      case 'documents':
        maxDocumentId++;
        updateObject = { maxDocumentId: maxDocumentId };
        nextId = maxDocumentId;
        break;
      case 'messages':
        maxMessageId++;
        updateObject = { maxMessageId: maxMessageId };
        nextId = maxMessageId;
        break;
      case 'contacts':
        maxContactId++;
        updateObject = { maxContactId: maxContactId };
        nextId = maxContactId;
        break;
      default:
        return -1;
    }

    try {
      await Sequence.updateOne({ _id: sequenceId }, { $set: updateObject })
    } catch (err) {
      console.log("nextId error = " + err);
      return null
    }

    return nextId;
  }
}

// async function SequenceGenerator() {
//   let sequence
//   try {
//     sequence = await Sequence.findOne()
//   } catch (err) {
//     console.error({
//       title: 'An error occurred',
//       error: err
//     })

//     sequenceId = sequence._id;
//     maxDocumentId = sequence.maxDocumentId;
//     maxMessageId = sequence.maxMessageId;
//     maxContactId = sequence.maxContactId;
//   }
// }

// SequenceGenerator.prototype.nextId = async function (collectionType) {

//   var updateObject = {};
//   var nextId;

//   switch (collectionType) {
//     case 'documents':
//       maxDocumentId++;
//       updateObject = { maxDocumentId: maxDocumentId };
//       nextId = maxDocumentId;
//       break;
//     case 'messages':
//       maxMessageId++;
//       updateObject = { maxMessageId: maxMessageId };
//       nextId = maxMessageId;
//       break;
//     case 'contacts':
//       maxContactId++;
//       updateObject = { maxContactId: maxContactId };
//       nextId = maxContactId;
//       break;
//     default:
//       return -1;
//   }

//   try {
//     await Sequence.update({ _id: sequenceId }, { $set: updateObject })
//   } catch (err) {
//     console.log("nextId error = " + err);
//     return null
//   }

//   return nextId;
// }

module.exports = new SequenceGenerator();
