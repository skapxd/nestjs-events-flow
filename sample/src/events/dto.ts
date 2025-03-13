import { ApiProperty } from '@nestjs/swagger';

export class BodyDto {
  @ApiProperty({ default: 'test@test.com' })
  email: string;

  @ApiProperty({ default: 'test' })
  username: string;
}
