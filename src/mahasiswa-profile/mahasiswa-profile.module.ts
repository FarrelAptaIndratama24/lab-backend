import { Module } from '@nestjs/common';
import { MahasiswaProfileController } from './mahasiswa-profile.controller';
import { MahasiswaProfileService } from './mahasiswa-profile.service';
import  PrismaService  from '../prisma';  // Pastikan PrismaService di-import dengan benar

@Module({
  imports: [],  
  controllers: [MahasiswaProfileController],
  providers: [MahasiswaProfileService, PrismaService], 
  exports: [PrismaService],  
})
export class MahasiswaProfileModule { }
