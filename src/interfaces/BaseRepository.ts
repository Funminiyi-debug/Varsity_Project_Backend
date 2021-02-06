import IRead from "./IRead";
import IWrite from "./IWrite";
import { Collection, Db } from "mongodb";

abstract class BaseRepository<TEntity>
  implements IRead<TEntity>, IWrite<TEntity> {
  private _collection: Collection;
  /**
   *
   */
  constructor(db: Db, collectionName: string) {
    this._collection = db.collection(collectionName);
  }
  async findAll(): Promise<any> {
    const results = await this._collection.find();
  }
  findOne(): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
  findByCondition(conditions: object): Promise<TEntity[]> {
    throw new Error("Method not implemented.");
  }
  createOne(entity: TEntity): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  createMany(entities: TEntity[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(entity: TEntity): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateMany(entities: TEntity[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteMany(ids: String[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default BaseRepository;
