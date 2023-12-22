import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RequestInterface } from 'src/common/interfaces';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getMe(@Req() req: RequestInterface) {
    return await this.authService.getMe(req.email);
  }

  @Get('/social/google/link')
  async get(): Promise<string> {
    return await this.authService.getAuthUrl();
  }

  @Post('/social/google/login')
  async postSth(@Query() dto: { code: string }, @Res() res: Response) {
    if (!dto.code) throw new BadRequestException('Code is required');
    const token = await this.authService.login(dto.code);

    const date = new Date();
    date.setTime(date.getTime() + 31 * 24 * 60 * 60 * 1000);
    res.cookie('WSP_AUTHORIZATION_COOKIE', token, {
      signed: true,
      expires: date,
      secure: false,
      // domain: '.localhost',
      domain: '.wsp.company',
      httpOnly: false,
      path: '/',
    });
    return res.sendStatus(200);
  }
}
