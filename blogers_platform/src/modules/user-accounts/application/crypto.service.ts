import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  async comparePasswords(args: { password: string; hash: string }): Promise<boolean> {
    return await bcrypt.compare(args.password, args.hash);
  }
}