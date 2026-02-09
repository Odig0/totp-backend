import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TotpModule } from './totp/totp.module';

@Module({
  imports: [TotpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
