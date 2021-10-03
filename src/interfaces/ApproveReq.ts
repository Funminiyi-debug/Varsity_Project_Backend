import PostStatus from "../enums/PostStatus";

export interface ApproveReq {
  postid: string;
  approvalStatus: PostStatus;
}
