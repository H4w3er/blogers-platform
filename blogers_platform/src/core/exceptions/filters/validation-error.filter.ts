import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ValidationErrorResponse,
  ValidationErrorType,
} from "../validation-error.interface";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errors = this.formatErrors(exception.getResponse());
    const errorResponse: ValidationErrorResponse = {
      errorsMessages: errors,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  private formatErrors(validationError: any): ValidationErrorType[] {
    const errors: ValidationErrorType[] = [];

    if (validationError.message.length > 1) {
      validationError.message.forEach((error) => {
        errors.push({
          message: error,
          field: error.split(" ")[0].toLowerCase(),
        });
      });
    } else {
      errors.push({
        message: validationError.message[0],
        field: validationError.message[0].split(" ")[0].toLowerCase(),
      });
    }
    return errors;
  }
}
