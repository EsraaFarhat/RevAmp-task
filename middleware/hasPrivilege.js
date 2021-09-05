const { Ticket } = require("../models/ticket");

module.exports = async function (req, res, next) {
  // if it's an admin || customer service agent
  if(req.user.role !== "customer")
    next();

  // if it's a customer and not his ticket
    if (req.user.role === "customer" && req.params.ticketId){
      const ticket = await Ticket.find({_id: req.params.ticketId, customer: req.user._id});
      if(!ticket)
        return res.status(403).send({ message: "Access denied." });
      else
        next();
    } else {
      return res.status(403).send({ message: "Access denied." });
    }
  };