import { Test, TestingModule } from '@nestjs/testing';
import { MahasiswaProfileController } from './mahasiswa-profile.controller';
import { MahasiswaProfileService } from './mahasiswa-profile.service';

describe('MahasiswaProfileController', () => {
  let controller: MahasiswaProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MahasiswaProfileController],
      providers: [MahasiswaProfileService],
    }).compile();

    controller = module.get<MahasiswaProfileController>(MahasiswaProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
