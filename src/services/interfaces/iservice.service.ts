import { Document } from "mongoose";
import { IProductFilter, IService } from "../../interfaces/entities";

export default interface IServiceService {
  getServices(): Promise<Document<any>[]>;

  getService(id: string): Promise<Document<any>[]>;

  getServicesByCondition(
    query: IProductFilter,
    userid: string
  ): Promise<Document<any>[]>;

  createService(
    entity: IService,
    files: any,
    email: string
  ): Promise<Document<any>>;

  updateService(
    id: string,
    files: any,
    entity: any,
    userEmail: string
  ): Promise<Document<any>>;

  deleteService(id: string, userEmail: string): Promise<Document<any>>;

  addFeedbacksToService(
    serviceid: string,
    feedbackids: string[],
    useremail: string
  );
}
