import IAppException from "../interfaces/AppException";
import AppException from "../enums/Exceptions";
import { DataResponse } from "../interfaces/DataResponse";

const handleAppExceptions = (error: IAppException): DataResponse => {
  switch (error.name) {
    case AppException.BadDataException:
      return { statusCode: 400, message: error.message };
    case AppException.ForbiddenException:
      return { statusCode: 409, message: error.message };
    case AppException.ServerErrorException:
      // console.log(
      //   `${error.name}:
      //        ${error.message}`
      // );
      return { statusCode: 500, message: "Server Error" };
    case AppException.NotFoundException:
      return { statusCode: 404, message: error.message };
    case AppException.ConflictException:
      return { statusCode: 409, message: error.message };
    case AppException.UnauthorizedException:
      return { statusCode: 403, message: error.message };

    default:
      // console.log(
      //   `
      //   Unhandled error==============
      //   ${error.name}:
      //       ${error.message}`
      // );
      return { statusCode: 500, message: "Server Error" };
  }
};

export default handleAppExceptions;
