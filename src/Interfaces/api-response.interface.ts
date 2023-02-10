export interface apiResponse {
  status: boolean;
  statusCode: number;
  error?: string;
  message?: string;
  data?: any;
}
