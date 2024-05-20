import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsObjectId } from 'nestjs-object-id';

export class UserCreateAccountDto {
  
  @ApiProperty({
    description: 'User first name',
    maxLength: 100,
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    maxLength: 100,
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User account email',
    maxLength: 100,
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    maxLength: 16,
    example: '1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Account password',
    maxLength: 50,
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'User birth date',
    format: 'yyyy-mm-dd',
    example: '1990-01-01',
  })
  birthday: string;
}
