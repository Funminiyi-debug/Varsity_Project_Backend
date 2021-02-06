"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./config/passport"));
require("dotenv/config");
const user_route_1 = __importDefault(require("./routes/user.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const db_1 = __importDefault(require("./config/db"));
passport_2.default(passport_1.default);
db_1.default();
const app = express_1.default();
const port = process.env.PORT || 3001;
// PASSPORT CONFIG
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(morgan_1.default(":method :url statusCode ===  :status :res[content-length] - :response-time ms"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//COOKIE CONFIG
app.use(cookie_session_1.default({
    name: "versitysession",
    keys: ["key1", "key2"],
}));
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
app.get("/", (req, res) => {
    res.send("working");
});
const auth = require("./routes/auth");
app.use("/", user_route_1.default);
app.use("/auth", auth);
app.use("/categories", category_route_1.default);
app.listen(port, () => {
    console.log(`subscriber connected to ${port}`);
});
//# sourceMappingURL=server.js.map