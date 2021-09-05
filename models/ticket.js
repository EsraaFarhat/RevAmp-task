const Joi = require("joi");
const mongoose = require("mongoose");

require("./user");

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "pending", "closed"],
        default: "pending",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

function validateTicket(ticket) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        status: Joi.string.default("pending"),
    });
    return schema.validate(ticket);
}

module.exports.Ticket = Ticket;
module.exports.validate = validateTicket;