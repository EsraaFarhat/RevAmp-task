const Joi = require("joi");
const mongoose = require("mongoose");

require("./user");
require("./ticket");


const TicketNoteSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        trim: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


const TicketNote = mongoose.model("TicketNote", TicketNoteSchema);

function validateTicketNote(note) {
    const schema = Joi.object({
      content: Joi.string().min(1).max(255).trim().required(),
    });
    return schema.validate(note);
  }


module.exports.TicketNote = TicketNote;
module.exports.validateAddNote = validateTicketNote;
