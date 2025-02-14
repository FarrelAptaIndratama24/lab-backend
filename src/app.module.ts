import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import PrismaService from './prisma';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { MahasiswaProfileModule } from './mahasiswa-profile/mahasiswa-profile.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'sdfsghttyu45etgerte4r34fe',
    }),
    ProfileModule,
    MahasiswaProfileModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
