import { awsSesConfiguration } from '@app/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AbstractEmailService } from './abstract-email.service';
import { EmailService } from './email.service';
import { SesEmailService } from './ses-email.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(awsSesConfiguration)],
  providers: [
    {
      provide: AbstractEmailService,
      useClass: SesEmailService,
    },
    EmailService,
  ],
  exports: [AbstractEmailService, EmailService],
})
export class EmailModule {}
