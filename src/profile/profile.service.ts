import { Injectable, NotFoundException } from '@nestjs/common';
import PrismaService from '../prisma';  
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { extname } from 'path';
import { join } from 'path'; 

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) { }  

    async uploadFile(file: Express.Multer.File, user_id: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: user_id },
        });

        if (!user) throw new NotFoundException("Tidak Menemukan User");

        if (user.foto_profile) {
            const filePath = join(process.cwd(), 'uploads', user.foto_profile);
            if (existsSync(filePath)) {
                rmSync(filePath);  
            }
        }

        const uploadPath = join(process.cwd(), 'uploads');
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);  
        }

        const fileExt = extname(file.originalname);  
        const baseFilename = user.username; 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  
        const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;  
        const filePath = join(uploadPath, filename);  

        writeFileSync(filePath, file.buffer);  

        await this.prisma.user.update({
            where: { id: user_id },
            data: { foto_profile: filename },  
        });

        return { filename, path: filePath };  
    }

    async sendMyFotoProfile(user_id: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: user_id  
            }
        });

        if (!user) throw new NotFoundException("User tidak ditemukan");

        return user.foto_profile;  
    }
}
