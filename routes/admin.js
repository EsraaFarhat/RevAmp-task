const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");

const { User } = require("../models/user");
const { Ticket } = require("../models/ticket");
const { TicketNote } = require("../models/ticket_note");

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    resources: [User, Ticket, TicketNote],
    rootPath: "/admin",
})

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;