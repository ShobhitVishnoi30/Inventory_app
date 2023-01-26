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
import { InventoryDto } from 'src/Dto/createInventory.dto';
import { FilterInventoryDto } from 'src/Dto/filterInventory.dto';
import { UpdateInventoryDto } from 'src/Dto/updateInventory.dto';
import { ResponseDTO } from 'src/Dto/response.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('insert')
  async insert(@Body() inventoryDto: InventoryDto): Promise<ResponseDTO> {
    const addedInventory = await this.inventoryService.createInventory(
      inventoryDto,
    );
    return {
      success: true,
      message: 'Inventory added successfully',
      data: addedInventory,
    };
  }

  @Get()
  async getAllInventory(): Promise<ResponseDTO> {
    const inventoryData = await this.inventoryService.getAllInventory();
    return {
      success: true,
      message: 'Inventory fetched successfully',
      data: inventoryData,
    };
  }

  @Patch(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<ResponseDTO> {
    const updatedInventory = await this.inventoryService.updateInventory(
      id,
      updateInventoryDto,
    );

    return {
      success: true,
      message: 'Inventory updated successfully',
      data: updatedInventory,
    };
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: string): Promise<ResponseDTO> {
    const deletedInventory = await this.inventoryService.deleteInventory(id);
    return {
      success: true,
      message: 'Inventory deleted successfully',
      data: deletedInventory,
    };
  }

  @Get('/filter')
  async getFilteredInventory(
    @Body() filterInventoryDto: FilterInventoryDto,
  ): Promise<ResponseDTO> {
    return this.inventoryService.getFilteredInventory(filterInventoryDto);
  }
}
