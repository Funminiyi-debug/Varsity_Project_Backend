export interface DataResponse {
  statusCode: number;
  data?: any;
  message?: string;
}

export interface AuthResponse {
  statusCode: number;
  token: string;
  message?: string;
}

export interface SmsRequest {
  phoneNumber: string;
}

export interface SmsCodeRequest {
  phoneCode: string;
}

export interface Username {
  username: string;
}

export interface Name {
  first: string;
  last?: string;
}

export interface UserCreationRequest {
  id: string;
  verificationStatus: any;
}
