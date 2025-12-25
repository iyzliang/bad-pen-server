import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers';
import { UserService } from './services';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
