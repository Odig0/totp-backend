import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateSync } from 'otplib';
import { TotpServiceEntity } from '../entities/totp-service.entity';
import { EncryptionService } from '../common/encryption.service';

export interface ServiceSecret {
  name: string;
}

@Injectable()
export class TotpService {
  constructor(
    @InjectRepository(TotpServiceEntity)
    private totpServiceRepository: Repository<TotpServiceEntity>,
    private encryptionService: EncryptionService,
  ) {}

  async registerService(
    userId: string,
    name: string,
    secret: string,
  ): Promise<ServiceSecret> {
    const normalizedSecret = secret.replace(/\s+/g, '').toUpperCase();
    const normalizedName = name.toLowerCase();

    const existingService = await this.totpServiceRepository.findOne({
      where: { userId, serviceName: normalizedName },
    });

    if (existingService) {
      throw new ConflictException(
        `Service "${name}" already exists for this user`,
      );
    }

    const encryptedSecret = this.encryptionService.encrypt(normalizedSecret);

    const service = this.totpServiceRepository.create({
      userId,
      serviceName: normalizedName,
      encryptedSecret,
    });

    await this.totpServiceRepository.save(service);

    return { name: normalizedName };
  }

  async generateOtp(
    userId: string,
    name: string,
  ): Promise<{
    service: string;
    otp: string;
    expiresIn: number;
  }> {
    const service = await this.totpServiceRepository.findOne({
      where: { userId, serviceName: name.toLowerCase() },
    });

    if (!service) {
      throw new NotFoundException(`Service "${name}" not found`);
    }

    const secret = this.encryptionService.decrypt(service.encryptedSecret);
    const otp = generateSync({ secret });
    const expiresIn = this.getTimeRemaining();

    return {
      service: name,
      otp,
      expiresIn,
    };
  }

  private getTimeRemaining(): number {
    const epoch = Math.floor(Date.now() / 1000);
    const step = 30;
    const remaining = step - (epoch % step);
    return remaining;
  }

  async getAllServices(userId: string): Promise<string[]> {
    const services = await this.totpServiceRepository.find({
      where: { userId },
      select: ['serviceName'],
    });

    return services.map((s) => s.serviceName);
  }

  async deleteService(userId: string, name: string): Promise<void> {
    const result = await this.totpServiceRepository.delete({
      userId,
      serviceName: name.toLowerCase(),
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Service "${name}" not found`);
    }
  }
}
