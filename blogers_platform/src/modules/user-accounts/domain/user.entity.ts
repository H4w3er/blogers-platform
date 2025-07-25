import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Error, HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Name, NameSchema } from './name.schema';


@Schema({ timestamps: true })
export class User {

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, min: 5, required: true })
  email: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  // @Prop(NameSchema) this variant from doc doesn't make validation for inner object
  @Prop({ type: NameSchema })
  name: Name;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.isEmailConfirmed = false; // пользователь ВСЕГДА должен после регистрации подтверждить свой Email

    user.name = {
      firstName: 'firstName xxx',
      lastName: 'lastName yyy',
    };
    user.deletedAt = null;
    return user as UserDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
      this.email = dto.email;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;