import express, { Application } from "express";
import http from "http";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import "reflect-metadata";
import cookieSession from "cookie-session";
import passport from "passport";
import passportConfig from "./config/passport";
import "dotenv/config";
import databaseConnection from "./config/db";
import categoryModule from "./routes/category.route";
import productModule from "./routes/product.route";
import authModule from "./routes/auth.route";
import userModule from "./routes/user.route";
import commentModule from "./routes/comment.route";
import dashboardModule from "./routes/dashboard.route";
import subcategoryModule from "./routes/subcategory.route";
import notificationModule from "./routes/notification.route";
import postModule from "./routes/post.route";
import feedbackMoodule from "./routes/feedback.route";
import redisMiddleware from "./middlewares/redis";
import authMiddleware from "./middlewares/auth";
import runConnection from "./sockets/index";
import mongoose from "mongoose";
const app: Application = express();
const server = http.createServer(app);
mongoose.set("useCreateIndex", true);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: "*",
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    ],
  },
});
const port = process.env.PORT || 3001;
// PASSPORT CONFIG
passportConfig(passport);
databaseConnection();

app.use(cors());
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  morgan(
    ":method :url statusCode ===  :status :res[content-length] - :response-time ms"
  )
);
//COOKIE CONFIG
app.use(
  cookieSession({
    name: "versitysession",
    keys: ["key1", "key2"],
  })
);

// app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
// REDIS
app.use(authMiddleware.authMiddleware);

app.use(function (req, res, next) {
  for (var key in req.query) {
    req.query[key.toLowerCase()] = req.query[key];
  }
  next();
});
app.use(redisMiddleware);

app.use("/api/auth", authModule);
app.use("/api/categories", categoryModule);
app.use("/api/products", productModule);
app.use("/api/subcategories", subcategoryModule);
app.use("/api/users", userModule);
app.use("/api/posts", postModule);
app.use("/api/feedbacks", feedbackMoodule);
app.use("/api/comments", commentModule);
app.use("/api/notifications", notificationModule);
app.use("/api/dashboard", dashboardModule);
// app.use("/",)

runConnection(io);

server.listen(port, () => {
  console.log(`subscriber connected to ${port}`);
});

//used in testing Env. for integration testing
module.exports = server;
