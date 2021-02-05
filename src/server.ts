import express, { Application } from "express";
import cors from "cors";
import user from "./routes/user.route";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
require("dotenv").config();
require("../config/passport")(passport);

const app: Application = express();
const port = process.env.PORT || 3001;

// PASSPORT CONFIG
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

const auth = require("./routes/auth");

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
