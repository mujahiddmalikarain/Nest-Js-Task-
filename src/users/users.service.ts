import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from './token.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>, // inject model
    private tokenService: TokenService,

  ) {}

  async register(registerDto: RegisterUserDto): Promise<{ message: string }> {
    try {
      
      // Destructure the registerDto object
      const { name, email, password } = registerDto;



      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user entity
      await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      return { message: 'Successfully registered' };
    } catch (error) {
      // Handle different types of errors
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Error while registering user');
      }
    }
  }

  async login(loginDto: loginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginDto;
      const user = await this.findUserByEmail(email);
      this.verifyPassword(password, user.password);
      const token = this.tokenService.generateToken(user._id.toString()); // Use the TokenService to generate the token app
      return { token };
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred during login process',
      );
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  private verifyPassword(plainPassword: string, hashedPassword: string): void {
    const isPasswordMatched = bcrypt.compareSync(plainPassword, hashedPassword);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
