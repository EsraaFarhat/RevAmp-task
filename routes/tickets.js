const auth = require("../middleware/auth");
const { Ticket, validate } = require("../models/ticket");
const { TicketNote, validateAddNote } = require("../models/ticket_note");
const { User } = require("../models/user");

const Joi = require("joi");
const express = require("express");
const router = express.Router();


router.get("/", async (req, res, next) => {
    const tickets = await Ticket.find().populate("customer").sort("-updatedAt");
    res.send({tickets});
});

router.get("/myTickets", auth, async (req, res, next) => {
    const tickets = await Ticket.find({
        customer: req.user._id
    }).populate("customer").sort("-updatedAt");
    res.send({tickets});
});

router.post("/", auth, async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id).select("_id");

    const ticket = new Ticket({
        title: req.body.title,
        status: req.body.status || "pending",
        customer: user,
        updatedAt: Date.now(),
    });
    await ticket.save();
    res.send({ticket});
});

router.post("/:id/addNote", auth, async (req, res, next) => {
    const { error } = validateAddNote(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id).select("_id");

    const note = new TicketNote({
        content: req.body.content,
        ticketId: req.params.id,
        userId: user,
    });
    await note.save();
    res.send({note});
});

router.patch("/:id", [auth], async (req, res, next) => {
    let id = req.params.id;

    const { error } = patchValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    ticket = await Ticket.findByIdAndUpdate(
        id,
        _.pick(req.body, ["status"]),
        {
          new: true,
          useFindAndModify: false,
        }
      );
    
      if (!ticket) return res.status(404).send({ message: "Ticket not found." });
    
      res.send({ ticket });
});


function patchValidate(ticket) {
    const schema = Joi.object({
        status: Joi.string().default("pending"),

    });
    return schema.validate(ticket);
}

module.exports = router;