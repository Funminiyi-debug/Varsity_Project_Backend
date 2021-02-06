interface IWrite<TEntity> {
  createOne(entity: TEntity): Promise<boolean>;
  //   true when all items are created successfully
  createMany(entities: TEntity[]): Promise<boolean>;
  update(entity: TEntity): Promise<boolean>;
  updateMany(entities: TEntity[]): Promise<boolean>;
  delete(id: String): Promise<boolean>;
  deleteMany(ids: String[]): Promise<boolean>;
}

export default IWrite;
