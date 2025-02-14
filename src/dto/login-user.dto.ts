import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @ApiProperty({
    description: 'Username for login',
    type: String,
    example: 'MUH. FARREL APTA INDRATAMA',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i)
  @Length(1, 30)
  username: string;

  @ApiProperty({
    description: 'Password for login',
    type: String,
    example: 'FARREL1234',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i)
  @Length(1, 30)
  password: string;
}
