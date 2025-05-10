import { ApiProperty } from '@nestjs/swagger';
export class CreateCvDto {
  @ApiProperty({
    description: 'The name of the CV owner',
    example: 'John',
  })
  name: string;

  @ApiProperty({
    description: 'The firstname of the CV owner',
    example: 'Doe',
  })
  firstname: string;

  @ApiProperty({
    description: 'The ID of the user associated with the CV',
    example: '12345',
  })
  userId: string;

  @ApiProperty({
    description: 'The age of the CV owner',
    example: 30,
  })
  age: number;

  @ApiProperty({
    description: 'The CIN (identity card number) of the CV owner',
    example: 'ABC123456',
  })
  cin: string;

  @ApiProperty({
    description: 'The job title of the CV owner',
    example: 'Software Engineer',
  })
  job: string;
}
