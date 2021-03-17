import PostSortBy from "../../enums/PostSortBy";

interface IPostFilter {
  sector?: string;
  sortBy?: PostSortBy;
  pageNo?: number;
  takeCount?: number;
  searchTerm?: string;
}
export default IPostFilter;
