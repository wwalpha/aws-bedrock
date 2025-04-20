import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from 'src/services/app.service';

@Controller('auth')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  signin() {
    return { message: 'Get user profile' };
  }

  @Post('logout')
  logout() {
    return { message: 'Get user profile' };
  }

  @Post('signup')
  signup() {
    return { message: 'Get user profile' };
  }

  @Get('session')
  session() {
    return { message: 'Get user profile' };
  }
}
