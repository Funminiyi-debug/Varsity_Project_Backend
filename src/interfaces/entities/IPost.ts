export default interface IPost {
  title?: string;
  // body?: string;
  postType?: string;
  question?: string;
  sector: string;
  options?: any[];
  pollExpiryDate?: Date;
}
