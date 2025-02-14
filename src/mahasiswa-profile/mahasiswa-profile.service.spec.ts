import { Test, TestingModule } from '@nestjs/testing';
import { MahasiswaProfileService } from './mahasiswa-profile.service';

describe('MahasiswaProfileService', () => {
  let service: MahasiswaProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MahasiswaProfileService],
    }).compile();

    service = module.get<MahasiswaProfileService>(MahasiswaProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
