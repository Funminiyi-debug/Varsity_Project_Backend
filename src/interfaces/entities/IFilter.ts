interface IFilter {
  name?: string;
  school?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: any;
  delivery?: string;
  otherFields?: any[];
}

export default IFilter;
