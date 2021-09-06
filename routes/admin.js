const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const { Ticket } = require("../models/ticket");
const { TicketNote } = require("../models/ticket_note");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

AdminBro.registerAdapter(AdminBroMongoose);

const canModifyUsers = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

const canAddUser = ({ currentAdmin }) => {
  return (
    currentAdmin &&
    (currentAdmin.role === "admin" || currentAdmin.role === "customer")
  );
};

const canAddTicket = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "customer";

const canModifyData = ({ currentAdmin }) => {
  return (
    currentAdmin &&
    (currentAdmin.role === "admin" ||
      currentAdmin.role === "customerServiceAgent")
  );
};

// const canModifyHisData = ({ currentAdmin, record }) => {
//     return (
//       currentAdmin &&
//       currentAdmin._id === record.param("customer"))
//   };


const adminBro = new AdminBro({
  resources: [
    {
      resource: User,
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
          password: {
            type: "password",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            isAccessible: canAddUser,
            before: async (request) => {
              console.log(request);
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
          list: { isAccessible: canModifyUsers },
        },
      },
    },
    {
      resource: Ticket,
      options: {
        // properties: {
        //   title: { isVisible: false },
        //   customer: { isVisible: false },
        // },
        actions: {
          new: { isAccessible: canAddTicket },
          list: { isAccessible: [canModifyData || canAddTicket]},
          edit: { isAccessible: canModifyData },
          delete: { isAccessible: false },
        },
      },
    },
    {
      resource: TicketNote,
      options: {
        actions: {
            new: { isAccessible: [canModifyData || canAddTicket ] },
            list: { isAccessible: [canModifyData || canAddTicket ] },
            edit: { isAccessible: false },
            delete: { isAccessible: false },
          },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    logo: "https://i.imgur.com/lVF0CbY.jpg",
    companyName: "RevAmp",
  },
});

const router = AdminBroExpress.buildAuthenticatedRouter(
  adminBro,
  {
    cookieName: process.env.ADMIN_COOKIE_NAME || "admin-bro",
    cookiePassword:
      process.env.ADMIN_COOKIE_PASS ||
      "supersecret-and-long-password-for-a-cookie-in-the-browser",
    authenticate: async (email, password) => {
      let user = await User.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) return user;
      }
      return false;
    },
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    // store: new MongoStore({
    //     mongooseConnection: mongoose.connection
    // }),
  }
);

module.exports = router;
