import {
  IsBoolean,
  isBoolean,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Double } from 'typeorm';

export class InventoryDto {
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  category: string;
}

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  productName: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  category: string;
}

export class FilterInventoryDto {
  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  moreThanGivenQuantity: Boolean = true;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  moreThanGivenPrice: Boolean = true;

  @IsOptional()
  @IsString()
  category: string;
}
