"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushCache = exports.refreshCache = exports.cacheData = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const cacheData = (key, data) => {
    const TIME_TO_LIVE = parseInt(process.env.CACHE_EXPIRY_TIME);
    if (data.data != undefined) {
        redis_1.default.setex(key, TIME_TO_LIVE, JSON.stringify(data.data));
    }
};
exports.cacheData = cacheData;
const refreshCache = (key) => {
    redis_1.default.del(key);
};
exports.refreshCache = refreshCache;
const flushCache = () => {
    redis_1.default.flushall();
};
exports.flushCache = flushCache;
//# sourceMappingURL=cache-data.js.map