interface IFilter {
  name: string;
  school: string;
  priceMin: string;
  priceMax: string;
  sortBy: any;
  otherFields?: any[];
}

export default IFilter;
