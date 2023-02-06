export class ResponseDTO {
  statusCode: number; // NOTE: Not necessary for every kind of response since we are sending it in response Headers
  success: boolean; // rename it to "status"
  message: string;
  itemCount: number; // NOTE: rename it to "results", not necessary for every kind of response
  data: any;
}
