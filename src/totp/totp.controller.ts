import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { TotpService } from './totp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';

class RegisterServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  secret!: string;
}

@Controller('services')
@UseGuards(JwtAuthGuard)
export class TotpController {
  constructor(private readonly totpService: TotpService) {}

  @Post()
  registerService(@GetUser() user: User, @Body() dto: RegisterServiceDto) {
    return this.totpService.registerService(user.id, dto.name, dto.secret);
  }

  @Get(':name/otp')
  getOtp(@GetUser() user: User, @Param('name') name: string) {
    return this.totpService.generateOtp(user.id, name);
  }

  @Get()
  getAllServices(@GetUser() user: User) {
    return this.totpService.getAllServices(user.id);
  }

  @Delete(':name')
  deleteService(@GetUser() user: User, @Param('name') name: string) {
    return this.totpService.deleteService(user.id, name);
  }
}
