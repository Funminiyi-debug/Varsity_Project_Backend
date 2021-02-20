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
      return { statusCode: 500, message: error.message };
    case AppException.NotFoundException:
      return { statusCode: 404, message: error.message };

    default:
      return { statusCode: 500, message: "Unhandled Error" };
      break;
  }
};
export default handleAppExceptions;
