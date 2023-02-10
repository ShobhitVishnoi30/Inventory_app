import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { InventoryDto } from './createInventory.dto';

export enum SortingOptions {
  Price = 'price',
  Quantity = 'quantity',
}

export enum Direction {
  EqualOrLess = 'less',
  EqualOrMore = 'more',
}

export class FilterInventoryDto extends PartialType(InventoryDto) {
  @IsOptional()
  @IsEnum(SortingOptions)
  sortBy: SortingOptions;

  @IsOptional()
  @IsEnum(Direction)
  sortDirection: Direction;

  @IsOptional()
  @IsBoolean()
  lowToHigh: Boolean;
}
