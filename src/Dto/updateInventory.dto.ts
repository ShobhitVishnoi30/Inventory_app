import { InventoryDto } from './createInventory.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateInventoryDto extends PartialType(InventoryDto) {}
