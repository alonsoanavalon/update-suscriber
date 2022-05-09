import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerService } from './logger/logger.service';
import { SuscriberModule } from './suscriber/suscriber.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SuscriberModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
