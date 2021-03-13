const checkCondition = (fromDb: string, test: string): boolean => {
  if (test == undefined) return true;
  return fromDb.toLowerCase() == test.toLowerCase();
};

export default checkCondition;
