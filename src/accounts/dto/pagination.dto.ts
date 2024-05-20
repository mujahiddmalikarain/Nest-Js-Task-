// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Number of items per page', default: 10 })
  @IsOptional()
 
  limit: number = 10;

  @ApiProperty({ description: 'Page number', default: 1 })
  @IsOptional()
  
  page: number = 1;
}
