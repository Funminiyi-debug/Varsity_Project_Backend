interface IFilter {
  name?: string;
  school?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: any;
  searchTerm?: string;
  delivery?: string;
  otherFields?: any[];
}

export default IFilter;
