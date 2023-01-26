import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
  async insertProduct(
    @Body() inventoryDto: InventoryDto,
  ): Promise<ResponseDTO> {
    try {
      const addedInventory = await this.inventoryService.insertProduct(
        inventoryDto,
      );
      return {
        statusCode: 200,
        success: true,
        message: 'Inventory added successfully',
        itemCount: 1,
        data: addedInventory,
      };
    } catch (e) {
      return {
        statusCode: 500,
        success: false,
        message: e.message,
        itemCount: 0,
        data: null,
      };
    }
  }

  @Get()
  async getAllInventory(): Promise<ResponseDTO> {
    const inventoryData = await this.inventoryService.getAllInventory();
    return {
      statusCode: 200,
      success: true,
      message: `Inventory fetched successfully with ${inventoryData.length} items`,
      itemCount: inventoryData.length,
      data: inventoryData,
    };
  }

  @Get('filter')
  async filterInventory(
    @Body() filterInventoryDto: FilterInventoryDto,
  ): Promise<ResponseDTO> {
    try {
      const fetchedInventory = await this.inventoryService.filteredInventory(
        filterInventoryDto,
      );
      return {
        statusCode: 200,
        success: true,
        message: 'Inventory fetched',
        itemCount: fetchedInventory.length,
        data: fetchedInventory,
      };
    } catch (e) {
      return {
        statusCode: e.status,
        success: false,
        message: e.message,
        itemCount: 0,
        data: null,
      };
    }
  }

  @Get(':id')
  async getInventoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDTO> {
    try {
      const inventoryData = await this.inventoryService.getInventoryById(id);
      return {
        statusCode: 200,
        success: true,
        message: 'Inventory fetched successfully',
        itemCount: 1,
        data: inventoryData,
      };
    } catch (e) {
      return {
        statusCode: e.status,
        success: false,
        message: e.message,
        itemCount: 0,
        data: null,
      };
    }
  }

  @Patch(':id')
  async updateInventory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<ResponseDTO> {
    try {
      const updatedInventory = await this.inventoryService.updateInventory(
        id,
        updateInventoryDto,
      );

      return {
        statusCode: 200,
        success: true,
        message: 'Inventory updated successfully',
        itemCount: 1,
        data: updatedInventory,
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: e.status,
        success: false,
        message: e.message,
        itemCount: 0,
        data: null,
      };
    }
  }

  @Delete(':id')
  async deleteInventory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDTO> {
    try {
      const deletedInventory = await this.inventoryService.deleteInventory(id);

      return {
        statusCode: 200,
        success: true,
        message: 'Inventory deleted successfully',
        itemCount: 1,
        data: deletedInventory,
      };
    } catch (e) {
      return {
        statusCode: e.status,
        success: false,
        message: e.message,
        itemCount: 0,
        data: null,
      };
    }
  }
}
