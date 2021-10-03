import PostSortBy from "../../enums/PostSortBy";
import PostStatus from "../../enums/PostStatus";

interface IPostFilter {
  sector?: string;
  sortBy?: PostSortBy;
  pageNo?: number;
  takeCount?: number;
  searchTerm?: string;
  status?: PostStatus;
}
export default IPostFilter;
