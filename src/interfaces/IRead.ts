interface IRead<TEntity> {
  findAll(): Promise<TEntity[]>;
  findOne(): Promise<TEntity>;
  findByCondition(conditions: object): Promise<TEntity[]>;
}
export default IRead;
