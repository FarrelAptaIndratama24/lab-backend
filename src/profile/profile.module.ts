import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import PrismaService from '../prisma';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
  exports: [ProfileService], 
})
export class ProfileModule { }
