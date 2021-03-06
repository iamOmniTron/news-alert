"use strict";

//requiring modules
const express = require("express");
const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/.env" });
}
const config = require("config");
const path = require("path");
const methodOverride = require("method-override");
const port = process.env.PORT;
const exphbs = require("express-handlebars");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const apiRouter = require("./routes/api/post-route");
const router = require("./routes/index");
const { truncate, stripTags, year } = require("./helpers/handlebars");
const app = express();
const secret = process.env.SECRET;
const mongoDB = process.env.MONGO_URI;

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongodb successfully"))
  .catch((err) => console.error("could not connect to mongodb", err));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "public"));
app.engine(
  "handlebars",
  exphbs({
    defaulLayout: "main",
    helpers: { truncate, stripTags, year },
  })
);
app.set("view engine", "handlebars");
app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  methodOverride(function (req, res) {
    if (req.body && req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { httpOnly: true, maxAge: 43200000, secure: false },
  })
);
app.use(flash());
app.use("/", router);
app.use("/api", apiRouter);
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("errors", { status: err.status, message: err.message });
});
app.listen(port, () => {
  console.log(`app listening at port:${port}`);
});
