import { codeExpiresConfiguration } from '@app/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/data-access/user';
import { UploadModule } from 'src/modules/upload';
import { UserConsumer } from './user.consumer';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [codeExpiresConfiguration] }),
    MikroOrmModule.forFeature([User]),
    UploadModule,
  ],
  controllers: [UserController, UserConsumer],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
