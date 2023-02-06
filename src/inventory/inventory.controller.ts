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
  // FIXME: By REST convention for POST mapping it is not required to have another url name, REST mentions to have different methods with same url name
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
        itemCount: 1, // NOTE: Not necessary for POST mapping response
        data: addedInventory,
      };
      /* 
        // NOTE: All the response objects can be modeled into a ResponseHandler

        The generic response message is 
        {
          status: <status_code> / <success/fail>
          message: <message response>, // can be skipped at some cases
          data: <response_data>
        }

        itemCount: rename it to "results", it is not necessary to have it in every response, only should be present in array response data

        In case you want to follow current format, you can use response-handler.service.ts file and inject that depedency and call response method / call the same inside interceptor and call the interceptor

        - Exceptions needs to be handled inside service file since almost all exceptions that occur are due to business logic
      */
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
      console.log(e); // NOTE: Remove console.log
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
