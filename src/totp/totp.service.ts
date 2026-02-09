import { Injectable, NotFoundException } from '@nestjs/common';
import { generateSync } from 'otplib';

export interface ServiceSecret {
  name: string;
}

@Injectable()
export class TotpService {
  private services: Map<string, string> = new Map();

  registerService(name: string, secret: string): ServiceSecret {
    const normalizedSecret = secret.replace(/\s+/g, '').toUpperCase();
    this.services.set(name.toLowerCase(), normalizedSecret);
    return { name };
  }

  generateOtp(name: string): {
    service: string;
    otp: string;
    expiresIn: number;
  } {
    const secret = this.services.get(name.toLowerCase());
    if (!secret) {
      throw new NotFoundException(`Service "${name}" not found`);
    }

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

  getAllServices(): string[] {
    return Array.from(this.services.keys());
  }
}
