import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import "reflect-metadata";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import passportConfig from "./config/passport";
import "dotenv/config";
import user from "./routes/user.route";
import category from "./routes/category.route";
import databaseConnection from "./config/db";

passportConfig(passport);
databaseConnection();

const app: Application = express();
const port = process.env.PORT || 3001;
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use(
  morgan(
    ":method :url statusCode ===  :status :res[content-length] - :response-time ms"
  )
);
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
//COOKIE CONFIG
app.use(
  cookieSession({
    name: "versitysession",
    keys: ["key1", "key2"],
  })
);

app.use(express.static("public"));
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.get("/", (req, res) => {
  res.send("working");
});

const auth = require("./routes/auth");
app.use("/", user);
app.use("/auth", auth);
app.use("/categories", category);
// PASSPORT CONFIG

// const server = new InversifyExpressServer(
//   container,
//   null,
//   { rootPath: "/api" },
//   app
// );

// server.setConfig((app) => {

// });
// server.build().
app.listen(port, () => {
  console.log(`subscriber connected to ${port}`);
});
