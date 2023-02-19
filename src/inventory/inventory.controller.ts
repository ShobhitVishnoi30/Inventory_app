import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InventoryDto } from 'src/inventory/Dto/createInventory.dto';
import { FilterInventoryDto } from 'src/inventory/Dto/filterInventory.dto';
import { UpdateInventoryDto } from 'src/inventory/Dto/updateInventory.dto';
import { InventoryService } from './inventory.service';
import { apiResponse } from 'src/Interfaces/api-response.interface';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async insertProduct(
    @Body() inventoryDto: InventoryDto,
  ): Promise<apiResponse> {
    return await this.inventoryService.insertProduct(inventoryDto);
  }

  @Get()
  async getAllInventory(): Promise<apiResponse> {
    return await this.inventoryService.getAllInventory();
  }

  @Get('filter')
  async filterInventory(
    @Body() filterInventoryDto: FilterInventoryDto,
  ): Promise<apiResponse> {
    return await this.inventoryService.filteredInventory(filterInventoryDto);
  }

  @Get(':id')
  async getInventoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<apiResponse> {
    return await this.inventoryService.getInventoryById(id);
  }

  @Patch(':id')
  async updateInventory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<apiResponse> {
    return await this.inventoryService.updateInventory(id, updateInventoryDto);
  }

  @Delete(':id')
  async deleteInventory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<apiResponse> {
    return await this.inventoryService.deleteInventory(id);
  }
}
