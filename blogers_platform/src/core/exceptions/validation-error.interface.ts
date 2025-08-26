export interface ValidationErrorType {
  message: string;
  field: string;
}

export interface ValidationErrorResponse {
  errorsMessages: ValidationErrorType[];
}