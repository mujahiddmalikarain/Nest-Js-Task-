import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  signUp(@Body() registerDto: RegisterUserDto): Promise<{ message: string }> {
    return this.userService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: loginUserDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }
}
