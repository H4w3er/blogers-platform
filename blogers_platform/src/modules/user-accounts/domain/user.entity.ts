import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Error, HydratedDocument, Model } from "mongoose";
import { UpdateUserDto } from "../dto/create-user.dto";
import { CreateUserDomainDto } from "./dto/create-user.domain.dto";
import { Name, NameSchema } from "./name.schema";
import { BadRequestException } from '@nestjs/common';

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    ...loginConstraints,
  })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, unique: true,  ...emailConstraints })
  email: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: NameSchema })
  name: Name;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: String })
  confirmationCode: string;

  @Prop({ type: String })
  recoveryCode: string;

  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.isEmailConfirmed = false;
    user.confirmationCode = "";

    user.name = {
      firstName: "firstName xxx",
      lastName: "lastName yyy",
    };
    user.deletedAt = null;
    return user as UserDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error("Entity already deleted");
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
      this.email = dto.email;
    }
  }

  setConfirmation() {
    if (this.isEmailConfirmed){
      throw new BadRequestException({
        message: ['Email already confirmed']
      })
    }
    this.isEmailConfirmed = true;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
