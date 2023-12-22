import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey: string = '47g12uijdas';

  constructor() {}

  generateToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }
  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      return error.message;
    }
  }
}
