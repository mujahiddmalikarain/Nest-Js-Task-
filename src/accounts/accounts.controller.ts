import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';

import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe, Request } from '@nestjs/common';
import { UserCreateAccountDto } from './dto/create-user-account.dto';
import { UserUpdateAccountDto } from './dto/update-user-account.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UserAccount } from './entities/user-account.entity';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ValidationPipe()) userCreateAccountDto: UserCreateAccountDto,
  ) {
    console.log(req.user?._id);
    try {
      const newUserAccount = await this.accountsService.create(
        userCreateAccountDto,
        req.user?._id,
      );
      return {
        message: 'User created successfully',
        account: newUserAccount,
        statusCode: 200,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<UserAccount[]> {
    return await this.accountsService.findAllWithPagination(paginationDto);
  }
  catch(error) {
    throw new InternalServerErrorException(
      'Error occurred while fetching accounts.',
      error,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.accountsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) userUpdateAccountDto: UserUpdateAccountDto,
  ) {
    try {
      return await this.accountsService.update(id, userUpdateAccountDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      
      await this.accountsService.remove(id);
      // If deletion is successful, return a success message
      return { message: 'Account deleted successfully', statusCode: HttpStatus.OK };
    } catch (error) {
      // Catch any errors and throw an internal server error with the error message
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
