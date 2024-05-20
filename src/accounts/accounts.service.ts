import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UserUpdateAccountDto } from './dto/update-user-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';


import { UserCreateAccountDto } from './dto/create-user-account.dto';
import { UserAccount } from './entities/user-account.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('UserAccount')
    private readonly userAccountModel: Model<UserAccount>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(
    userCreateAccountDto: UserCreateAccountDto,
    userobjectid: string,
  ) {
    console.log(userobjectid);
    try {
      const user = await this.userModel.findById(userobjectid);
      if (!user) {
        throw new Error('User not found');
      }

      const account = new this.userAccountModel({
        user: user._id,
        ...userCreateAccountDto,
      });

      return account.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<UserAccount[]> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit; 
    return this.userAccountModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string) {
    try {
      // Check if the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid account id.');
      }

      const account = await this.userAccountModel.findById(id).exec();
      if (!account) {
        throw new NotFoundException('Account not found.');
      }
      return account;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async update(id: string, userUpdateAccountDto: UserUpdateAccountDto) {
    try {
      // Check if the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid account id.');
      }

      const updatedAccount = await this.userAccountModel.findByIdAndUpdate(
        id,
        userUpdateAccountDto,
        { new: true },
      );

      // If the account is not found, throw NotFoundException
      if (!updatedAccount) {
        throw new NotFoundException('Account not found.');
      }

      return updatedAccount;
    } catch (error) {
      // Catch any MongoDB or other internal errors and throw a BadRequestException
      throw new BadRequestException(error.message);
    }
  
  }

  async remove(id: string) {
    try {
      const deletedAccount = await this.userAccountModel.findByIdAndDelete(id);
      if (!deletedAccount) {
        throw new NotFoundException('Account not found.');
      }
      return deletedAccount;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
