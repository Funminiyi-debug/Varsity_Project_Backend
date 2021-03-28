"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    /**
     *
     */
    constructor(db, collectionName) {
        this._collection = db.collection(collectionName);
    }
    async findAll() {
        const results = await this._collection.find();
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