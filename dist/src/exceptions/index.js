"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessedEntityException = exports.ConflictException = exports.BadDataException = exports.NotFoundException = exports.ForbiddenException = exports.ServerErrorException = void 0;
var ServerErrorException_1 = require("./ServerErrorException");
Object.defineProperty(exports, "ServerErrorException", { enumerable: true, get: function () { return __importDefault(ServerErrorException_1).default; } });
var ForbiddenException_1 = require("./ForbiddenException");
Object.defineProperty(exports, "ForbiddenException", { enumerable: true, get: function () { return __importDefault(ForbiddenException_1).default; } });
var NotFoundException_1 = require("./NotFoundException");
Object.defineProperty(exports, "NotFoundException", { enumerable: true, get: function () { return __importDefault(NotFoundException_1).default; } });
var BadDataException_1 = require("./BadDataException");
Object.defineProperty(exports, "BadDataException", { enumerable: true, get: function () { return __importDefault(BadDataException_1).default; } });
var ConflictException_1 = require("./ConflictException");
Object.defineProperty(exports, "ConflictException", { enumerable: true, get: function () { return __importDefault(ConflictException_1).default; } });
var UnprocessedEntityException_1 = require("./UnprocessedEntityException");
Object.defineProperty(exports, "UnprocessedEntityException", { enumerable: true, get: function () { return __importDefault(UnprocessedEntityException_1).default; } });
//# sourceMappingURL=index.js.map