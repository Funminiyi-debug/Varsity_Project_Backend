import { inject, injectable } from "inversify";
import VStatus from "../enums/VerificationStatus";
import DashboardMetrics from "../interfaces/DashboardMetrics";
import Types from "../types";
import {
  IUserService,
  IDashboardService,
  IProductService,
  IPostService,
} from "./interfaces";

@injectable()
export default class DashboardService implements IDashboardService {
  /**
   *
   */
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.IProductService) private productService: IProductService,
    @inject(Types.IPostService) private postService: IPostService
  ) {}

  //   //  usersCount: number;
  //   activeUsersCount: number;
  //   dailyUsersCount: number;
  //   totalPostedAds: number;
  //   dailyPostedAds: number;
  //   totalPostsCount: number;
  //   dailyPostsCount: number;
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const allUsers = await this.userService.getUsers();
    const totalUsers = allUsers.length;
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const dailyUsers = allUsers.filter(
      (user: any) => user.createdAt >= startOfDay
    ).length;
    const activeUsers = allUsers.filter((user: any) => {
      user.verificationStatus == VStatus.Verified;
    }).length;

    const allAds = await this.productService.getProducts();
    const totalAds = allAds.length;
    const dailyPostedAds = allAds.filter(
      (ad: any) => ad.createdAt >= startOfDay
    ).length;

    const allPosts = await this.postService.getPosts();
    const totalPosts = allPosts.length;
    const dailyPosts = allPosts.filter(
      (post: any) => post.createdAt >= startOfDay
    ).length;
    return {
      usersCount: totalUsers,
      dailyUsersCount: dailyUsers,
      totalPostedAds: totalAds,
      dailyPostedAds: dailyPostedAds,
      totalPostsCount: totalPosts,
      dailyPostsCount: dailyPosts,
      activeUsersCount: activeUsers,
    };
  }
}
