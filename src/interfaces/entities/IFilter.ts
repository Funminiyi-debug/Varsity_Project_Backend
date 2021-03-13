interface IFilter {
  name?: string;
  school?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: any;
  otherFields?: any[];
}

export default IFilter;
