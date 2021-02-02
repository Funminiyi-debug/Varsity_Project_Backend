import express, { Application } from "express";
import cors from "cors";
import user from "./routes/user.route";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";

const app: Application = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(morgan("tiny"));
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

app.use("/", user);

app.listen(port, () => {
  console.log(`subscriber connected to ${port}`);
});
