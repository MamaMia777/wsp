/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: any, done: Function) {
    done(null, user);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUser(payload.email);
    return user ? done(null, user) : done(null, null);
  }
}
