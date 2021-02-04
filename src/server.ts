import express, { Application } from "express";
import cors from "cors";
import user from "./routes/user.route";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
//import session from "express-session";
const app: Application = express();
const passport = require("passport");

dotenv.config();
const port = process.env.PORT;
require("../config/passport");
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

const middleWare = require("../middlewares/auth");
const auth = require("./routes/auth");

//app.use(middleWare.ensureAuth);

//app.use(express.static("public"));
//app.use(express.json());

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
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

app.use("/", user);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`subscriber connected to ${port}`);
});
