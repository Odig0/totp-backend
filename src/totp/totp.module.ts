import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpController } from './totp.controller';

@Module({
  providers: [TotpService],
  controllers: [TotpController],
})
export class TotpModule {}
