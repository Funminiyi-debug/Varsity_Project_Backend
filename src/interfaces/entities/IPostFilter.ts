import PostSortBy from "../../enums/PostSortBy";

interface IPostFilter {
  sector?: string;
  sortBy?: PostSortBy;
}
export default IPostFilter;
