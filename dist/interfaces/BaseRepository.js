"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    /**
     *
     */
    constructor(db, collectionName) {
        this._collection = db.collection(collectionName);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._collection.find();
        });
    }
    findOne() {
        throw new Error("Method not implemented.");
    }
    findByCondition(conditions) {
        throw new Error("Method not implemented.");
    }
    createOne(entity) {
        throw new Error("Method not implemented.");
    }
    createMany(entities) {
        throw new Error("Method not implemented.");
    }
    update(entity) {
        throw new Error("Method not implemented.");
    }
    updateMany(entities) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    deleteMany(ids) {
        throw new Error("Method not implemented.");
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map