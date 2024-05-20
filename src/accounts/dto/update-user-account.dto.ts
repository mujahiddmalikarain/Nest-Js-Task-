import { PartialType } from '@nestjs/mapped-types';
import { UserCreateAccountDto } from './create-user-account.dto';


export class UserUpdateAccountDto extends PartialType(UserCreateAccountDto) {}
