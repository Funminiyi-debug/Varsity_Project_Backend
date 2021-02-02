"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const port = process.env.PORT || 3001;
app.use(cors_1.default());
app.use(morgan_1.default("tiny"));
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
app.use("/", user_route_1.default);
app.listen(port, () => {
    console.log(`subscriber connected to ${port}`);
});
//# sourceMappingURL=server.js.map