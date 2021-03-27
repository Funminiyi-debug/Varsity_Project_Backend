"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = __importDefault(require("../enums/Exceptions"));
const handleAppExceptions = (error) => {
    switch (error.name) {
        case Exceptions_1.default.BadDataException:
            return { statusCode: 400, message: error.message };
        case Exceptions_1.default.ForbiddenException:
            return { statusCode: 409, message: error.message };
        case Exceptions_1.default.ServerErrorException:
            console.log(`${error.name}:
             ${error.message}`);
            return { statusCode: 500, message: "Server Error" };
        case Exceptions_1.default.NotFoundException:
            return { statusCode: 404, message: error.message };
        case Exceptions_1.default.UnprocessedEntityException:
            return { statusCode: 422, message: error.message };
        case Exceptions_1.default.ConflictException:
            return { statusCode: 409, message: error.message };
        case Exceptions_1.default.UnauthorizedException:
            return { statusCode: 403, message: error.message };
        default:
            console.log(`
        Unhandled error==============
        ${error.name}:
            ${error.message}`);
            return { statusCode: 500, message: "Server Error" };
    }
};
exports.default = handleAppExceptions;
//# sourceMappingURL=handleAppExceptions.js.map