import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { InventoryDto } from './createInventory.dto';

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
