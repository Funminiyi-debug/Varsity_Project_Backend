"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./config/passport"));
require("dotenv/config");
const db_1 = __importDefault(require("./config/db"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const subcategory_route_1 = __importDefault(require("./routes/subcategory.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const feedback_route_1 = __importDefault(require("./routes/feedback.route"));
const redis_1 = __importDefault(require("./middlewares/redis"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const index_1 = __importDefault(require("./sockets/index"));
const app = express_1.default();
const server = http_1.default.createServer(app);
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
passport_2.default(passport_1.default);
db_1.default();
app.use(cors_1.default());
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan_1.default(":method :url statusCode ===  :status :res[content-length] - :response-time ms"));
//COOKIE CONFIG
app.use(cookie_session_1.default({
    name: "versitysession",
    keys: ["key1", "key2"],
}));
// app.use(express.static("public"));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
// REDIS
app.use(auth_1.default.authMiddleware);
app.use(function (req, res, next) {
    for (var key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});
app.use(redis_1.default);
app.use("/api/auth", auth_route_1.default);
app.use("/api/categories", category_route_1.default);
app.use("/api/products", product_route_1.default);
app.use("/api/subcategories", subcategory_route_1.default);
app.use("/api/users", user_route_1.default);
app.use("/api/posts", post_route_1.default);
app.use("/api/feedbacks", feedback_route_1.default);
app.use("/api/comments", comment_route_1.default);
app.use("/api/notifications", notification_route_1.default);
// app.use("/",)
index_1.default(io);
server.listen(port, () => {
    console.log(`subscriber connected to ${port}`);
});
//used in testing Env. for integration testing
module.exports = server;
//# sourceMappingURL=server.js.map