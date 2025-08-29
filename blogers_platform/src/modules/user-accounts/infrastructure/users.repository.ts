import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOrNotFoundFail(id: Types.ObjectId | string): Promise<UserDocument> {
    const user = await this.findById(id.toString());

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ login });
  }

  async loginIsExist(login: string): Promise<boolean> {
    return !!(await this.UserModel.countDocuments({ login: login }));
  }

  async findByCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ confirmationCode: code });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email: email });
  }

  async findByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ recoveryCode: recoveryCode });
  }
}