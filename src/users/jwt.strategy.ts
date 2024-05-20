import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entities/user.entity';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private usermodel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: { id: any; }) {
    const { id } = payload;
    const user = await this.usermodel.findById(id);
    if (!user) {
      throw new UnauthorizedException('Login first to access to endpoint');
    }
    return user;
  }
}
