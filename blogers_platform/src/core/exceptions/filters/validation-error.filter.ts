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
    //console.log(exception);
    const errorResponse: ValidationErrorResponse = {
      errorsMessages: errors,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  private formatErrors(validationError: any): ValidationErrorType[] {
    const errors: ValidationErrorType[] = [];
    const seenFields = new Set<string>();

    validationError.message.forEach((error: string) => {
      const field = error.split(" ")[0];
      if (!seenFields.has(field)) {
        seenFields.add(field);
        errors.push({
          message: error,
          field: field,
        });
      }
    });

    return errors;
  }
}
