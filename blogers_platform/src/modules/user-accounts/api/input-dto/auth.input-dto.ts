import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegistrationConformationCodeDto {
  @IsString()
  code: string;
}

export class EmailDto {
  @IsEmail()
  email: string;
}

export class NewPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}
