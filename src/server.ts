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
import databaseConnection from "./config/db";
import categoryModule from "./routes/category.route";
import productModule from "./routes/product.route";
import authModule from "./routes/auth.route";
import userModule from "./routes/user.route";
import subcategoryModule from "./routes/subcategory.route";
import sampleModule from "./routes/sample.route";
import redisMiddleware from "./middlewares/redis";
import authMiddleware from "./middlewares/auth";
const app: Application = express();
const port = process.env.PORT || 3001;
passportConfig(passport);
databaseConnection();

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

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
// REDIS
app.use(authMiddleware.authMiddleware);
// app.use(redisMiddleware);

app.use("/auth", authModule);
app.use("/categories", categoryModule);
app.use("/products", productModule);
app.use("/subcategories", subcategoryModule);
// app.use("/subcategories", sampleModule);
app.use("/", userModule);

app.listen(port, () => {
  console.log(`subscriber connected to ${port}`);
});
