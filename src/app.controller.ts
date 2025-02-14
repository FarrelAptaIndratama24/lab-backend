import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { User } from './entity/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UserDecorator } from './decorator/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("register")
  @ApiBody({ type: RegisterUserDTO })
  register(@Body() user: RegisterUserDTO) {
    return this.appService.register(user)
  }

  @Post('login')
  @ApiBody({ type: LoginUserDTO })
  async login(@Body() data: LoginUserDTO) {
    return this.appService.login(data);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('mahasiswa')
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }

  @Get('mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswByNim(nim);
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user
  }

  @Post('mahasiswa')
  @ApiBody({ type: CreateMahasiswaDTO })
  createMahasiswa(@Body() data: CreateMahasiswaDTO) {
    return this.appService.addMahasiswa(data);
  }

  @Put('mahasiswa/:nim')
  @ApiBody({ type: CreateMahasiswaDTO })
  updateMahasiswa(@Param('nim') nim: string, @Body() data: CreateMahasiswaDTO) {
    return this.appService.updateMahasiswa(nim, data);
  }

  @Delete('mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.menghapusMahasiswa(nim);
  }
}