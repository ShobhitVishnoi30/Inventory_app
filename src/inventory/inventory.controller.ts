import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  FilterInventoryDto,
  InventoryDto,
  UpdateInventoryDto,
} from 'src/Dto/inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('insert')
  async insert(@Body() inventoryDto: InventoryDto): Promise<any> {
    return this.inventoryService.createInventory(inventoryDto);
  }

  @Get()
  async getInventory(): Promise<any> {
    return this.inventoryService.getInventory();
  }

  @Patch(':id')
  async updateInventory(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<any> {
    return this.inventoryService.updateInventory(id, updateInventoryDto);
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: number): Promise<any> {
    return this.inventoryService.deleteInventory(id);
  }

  @Get('/filter')
  async getFilteredInventory(
    @Body() filterInventoryDto: FilterInventoryDto,
  ): Promise<any> {
    return this.inventoryService.getFilteredInventory(filterInventoryDto);
  }
}
