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

  findAll(): Promise<TEntity[]> {
    throw new Error("Method not implemented.");
  }
  findOne(): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
  findByCondition(conditions: object): Promise<TEntity[]> {
    throw new Error("Method not implemented.");
  }
  createOne(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  createMany(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateMany(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteMany(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default BaseRepository;
