import { Controller, Route, Tags, Get, SuccessResponse, Response } from "tsoa";
import { DataResponse } from "../Interfaces/DataResponse";
import ErrorResponseModel from "../Interfaces/ErrorResponseModel";
import CategoryService from "../services/CategoryService";

@Route("/categories")
@Tags("Category")
export default class CategoriesController extends Controller {
  /**
   *
   */
  private cs: CategoryService;
  constructor(cs: CategoryService) {
    super();
    this.cs = cs;
  }
  @Get("/")
  @SuccessResponse("200", "OK")
  public async getCategories(): Promise<DataResponse> {
    const results = await this.cs.getCategories();
    const response: DataResponse = {
      statusCode: 200,
      data: results,
    };

    return response;
  }

  @Get("{id}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async getCategory(id: string): Promise<DataResponse> {
    const results = await this.cs.getCategory(id);
    const response: DataResponse = {
      statusCode: 500,
      data: [],
    };
    if (results.length > 0) {
      response.statusCode = 200;
      response.data = results;
    } else {
      response.statusCode = 404;
      response.data = null;
    }

    return response;
  }
}
