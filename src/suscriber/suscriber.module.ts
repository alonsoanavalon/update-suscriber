import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { LoggerModule } from 'src/logger/logger.module';
import { SuscriberController } from './suscriber.controller';
import { SuscriberService } from './suscriber.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [SuscriberController],
  providers: [SuscriberService],
})
export class SuscriberModule {}
