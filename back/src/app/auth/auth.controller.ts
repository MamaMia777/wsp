import { Controller, Get, UseGuards } from '@nestjs/common';
// @ts-ignore
import { GoogleAuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      msg: 'Google auth',
    };
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return {
      msg: 'Authorized',
    };
  }
}
