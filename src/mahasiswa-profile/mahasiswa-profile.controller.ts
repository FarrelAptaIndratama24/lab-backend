import { Controller, Post, Get, Param, Res, NotFoundException, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MahasiswaProfileService } from './mahasiswa-profile.service';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@ApiTags('Mahasiswa Profile')
@Controller('mahasiswa-profile')
export class MahasiswaProfileController {
  constructor(private readonly mahasiswaProfileService: MahasiswaProfileService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload foto profil mahasiswa' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        nim: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('nim') nim: string,
  ) {
    console.log('Received NIM:', nim);

    if (!file) {
      throw new BadRequestException('File tidak boleh kosong!');
    }

    if (!nim) {
      throw new BadRequestException('NIM tidak boleh kosong!');
    }

    return this.mahasiswaProfileService.uploadFile(file, nim);
  }

  @Get(':nim')
  @ApiOperation({ summary: 'Ambil foto profil mahasiswa berdasarkan NIM' })
  async getProfile(@Param('nim') nim: string, @Res() res: Response) {
    const filename = await this.mahasiswaProfileService.sendMyFotoProfile(nim);

    if (!filename) {
      throw new NotFoundException('Foto profil tidak ditemukan!');
    }

    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File tidak ditemukan di server');
    }

    return res.sendFile(filePath);
  }
}
