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
    try {
      const addedInventory = await this.inventoryService.createInventory(
        inventoryDto,
      );
      return {
        success: true,
        message: 'Inventory added successfully',
        data: addedInventory,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        data: null,
      };
    }
  }

  @Get()
  async getAllInventory(): Promise<ResponseDTO> {
    const inventoryData = await this.inventoryService.getAllInventory();
    return {
      success: true,
      message: `Inventory fetched successfully with ${inventoryData.length} items`,
      data: inventoryData,
    };
  }

  @Get(':id')
  async getInventoryById(@Param('id') id: string): Promise<ResponseDTO> {
    try {
      const inventoryData = await this.inventoryService.getInventoryById(id);
      return {
        success: true,
        message: 'Inventory fetched successfully',
        data: inventoryData,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        data: null,
      };
    }
  }

  @Patch(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<ResponseDTO> {
    try {
      const updatedInventory = await this.inventoryService.updateInventory(
        id,
        updateInventoryDto,
      );

      return {
        success: true,
        message: 'Inventory updated successfully',
        data: updatedInventory,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        data: null,
      };
    }
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: string): Promise<ResponseDTO> {
    try {
      const deletedInventory = await this.inventoryService.deleteInventory(id);

      return {
        success: true,
        message: 'Inventory deleted successfully',
        data: deletedInventory,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        data: null,
      };
    }
  }

  @Get('/filter')
  async getFilteredInventory(
    @Body() filterInventoryDto: FilterInventoryDto,
  ): Promise<ResponseDTO> {
    return this.inventoryService.getFilteredInventory(filterInventoryDto);
  }
}
