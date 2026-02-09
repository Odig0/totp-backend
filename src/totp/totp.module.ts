import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotpService } from './totp.service';
import { TotpController } from './totp.controller';
import { TotpServiceEntity } from '../entities/totp-service.entity';
import { EncryptionService } from '../common/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([TotpServiceEntity])],
  providers: [TotpService, EncryptionService],
  controllers: [TotpController],
})
export class TotpModule {}
