import { string } from "joi";

export interface DataResponse {
  statusCode: number;
  data: any;
  message?: string;
}

export interface Name {
  first: string;
  last?: string;
}

export interface UserCreationRequest {
  email: string;
  name: Name;
  phoneNumbers: string[];
}
