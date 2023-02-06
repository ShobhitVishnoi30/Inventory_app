import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { InventoryDto } from './createInventory.dto';

// NOTE: remove unused imports
// Please explain to me what are you trying to achieve here
// Do not assign values in here since it will take the assigned values, there is no optional assignment occuring here, which is why you many want to make them readonly
export class FilterInventoryDto extends PartialType(InventoryDto) {
  @IsBoolean()
  @IsOptional()
  moreThanGivenQuantity: Boolean = true;

  @IsBoolean()
  @IsOptional()
  moreThanGivenPrice: Boolean = true;

  @IsOptional()
  @IsBoolean()
  sortByName: Boolean = true;

  @IsOptional()
  @IsBoolean()
  sortByPrice: Boolean = true;

  @IsOptional()
  @IsBoolean()
  sortByQuantity: Boolean = true;
}
