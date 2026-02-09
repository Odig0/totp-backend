import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TotpService } from './totp.service';

class RegisterServiceDto {
  name!: string;
  secret!: string;
}

@Controller('services')
export class TotpController {
  constructor(private readonly totpService: TotpService) {}

  @Post()
  registerService(@Body() dto: RegisterServiceDto) {
    return this.totpService.registerService(dto.name, dto.secret);
  }

  @Get(':name/otp')
  getOtp(@Param('name') name: string) {
    return this.totpService.generateOtp(name);
  }

  @Get()
  getAllServices() {
    return {
      services: this.totpService.getAllServices(),
    };
  }
}
