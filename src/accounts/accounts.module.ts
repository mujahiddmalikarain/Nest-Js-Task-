import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountSchema } from './entities/user-account.entity';
import { UsersService } from 'src/users/users.service';
import { UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserAccount', schema: UserAccountSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService,],
})
export class AccountsModule {}
