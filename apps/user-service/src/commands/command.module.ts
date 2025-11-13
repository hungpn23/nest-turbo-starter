import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { dbConfiguration } from 'src/config';
import { User } from 'src/data-access/user';
import { CreateAdminCommand } from './create-admin.command';
import { CreateAdminQuestions } from './questions/create-admin.questions';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (dbConfig: ConfigType<typeof dbConfiguration>) => {
        return dbConfig;
      },
      inject: [dbConfiguration.KEY],
    }),
    MikroOrmModule.forFeature([User]),
  ],
  providers: [CreateAdminCommand, CreateAdminQuestions],
  exports: [],
})
export class CommandModule {}
