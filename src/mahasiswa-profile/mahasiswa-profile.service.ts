import { Injectable, NotFoundException } from '@nestjs/common';
import PrismaService  from '../prisma';
import { writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class MahasiswaProfileService {
    constructor(private readonly prisma: PrismaService) { }

    async uploadFile(file: Express.Multer.File, user_nim: string) {
        const user = await this.prisma.mahasiswa.findUnique({
            where: { nim: user_nim }, 
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan!');
        }

        const uploadPath = 'uploads'; 
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);  
        }

        const fileExt = extname(file.originalname); 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); 
        const filename = `${user.nim}-${uniqueSuffix}${fileExt}`; 
        const filePath = `${uploadPath}/${filename}`;

        writeFileSync(filePath, file.buffer);


        await this.prisma.mahasiswa.update({
            where: { nim: user_nim },  
            data: { foto_profile: filename },
        });

        return { filename, path: filePath };
    }

    async sendMyFotoProfile(user_nim: string) {
        const user = await this.prisma.mahasiswa.findUnique({
            where: { nim: user_nim },
        });

        if (!user || !user.foto_profile) {
            throw new NotFoundException('Foto profil tidak ditemukan');
        }

        return user.foto_profile; 
    }
}

