import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserConfigService } from './user-config.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserConfigService],
  exports: [UsersService, UsersRepository, UserConfigService],
})
export class UsersModule {}
