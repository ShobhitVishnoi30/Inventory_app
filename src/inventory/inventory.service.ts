import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryDto } from 'src/inventory/Dto/createInventory.dto';
import {
  Direction,
  FilterInventoryDto,
} from 'src/inventory/Dto/filterInventory.dto';
import { UpdateInventoryDto } from 'src/inventory/Dto/updateInventory.dto';
import { Inventory } from 'src/inventory/Entity/inventory.entity';
import { apiResponse } from 'src/Interfaces/api-response.interface';
import { ResponseHandlerService } from 'src/Utilities/response-handler.service';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  async insertProduct(inventoryDto: InventoryDto): Promise<apiResponse> {
    try {
      let inventory = this.inventoryRepository.create(inventoryDto);

      inventory = await this.inventoryRepository.save(inventory);

      return await this.responseHandlerService.response(
        '',
        HttpStatus.OK,
        'Inventory added statusfully',
        inventory,
      );
    } catch (e) {
      return await this.responseHandlerService.response(
        e.message,
        HttpStatus.BAD_REQUEST,
        'Inventory not added',
        '',
      );
    }
  }

  async getAllInventory(): Promise<apiResponse> {
    const inventories = await this.inventoryRepository.find();
    if (inventories.length != 0) {
      return this.responseHandlerService.response(
        null,
        HttpStatus.OK,
        'Inventory fetched successfully',
        inventories,
      );
    } else {
      return this.responseHandlerService.response(
        null,
        HttpStatus.NO_CONTENT,
        'No inventory found',
        inventories,
      );
    }
  }

  async getInventoryById(id: string): Promise<apiResponse> {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id,
      },
    });
    if (inventory) {
      return this.responseHandlerService.response(
        null,
        HttpStatus.OK,
        'Inventory fetched successfully',
        inventory,
      );
    } else {
      return this.responseHandlerService.response(
        null,
        HttpStatus.NO_CONTENT,
        'no such inventory exists',
        inventory,
      );
    }
  }

  async updateInventory(
    id: string,
    updateInventory: UpdateInventoryDto,
  ): Promise<apiResponse> {
    let inventory = await this.inventoryRepository.findOneBy({ id });

    if (inventory) {
      Object.keys(updateInventory).forEach((key) => {
        if (updateInventory[key]) {
          return (inventory[key] = updateInventory[key]);
        }
      });
      try {
        inventory = await this.inventoryRepository.save(inventory);
        return this.responseHandlerService.response(
          null,
          HttpStatus.OK,
          'Inventory updated successfully',
          inventory,
        );
      } catch (e) {
        return this.responseHandlerService.response(
          e.message,
          HttpStatus.BAD_REQUEST,
          'Inventory not updated',
          '',
        );
      }
    } else {
      return this.responseHandlerService.response(
        null,
        HttpStatus.NO_CONTENT,
        'no such inventory exists',
        inventory,
      );
    }
  }

  async deleteInventory(id: string): Promise<apiResponse> {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id,
      },
    });

    if (inventory) {
      await this.inventoryRepository.delete(id);
      return this.responseHandlerService.response(
        null,
        HttpStatus.OK,
        'Inventory deleted successfully',
        inventory,
      );
    } else {
      return this.responseHandlerService.response(
        null,
        HttpStatus.NO_CONTENT,
        'No such product found',
        inventory,
      );
    }
  }

  async filteredInventory(
    filterInventoryDto: FilterInventoryDto,
  ): Promise<apiResponse> {
    let where = {};
    let orderBy = {};
    let inventory: Inventory[];

    const {
      productName,
      category,
      price,
      quantity,
      sortBy,
      sortDirection,
      lowToHigh,
    } = filterInventoryDto;

    if (productName) {
      where['productName'] = productName;
    }
    if (quantity && sortDirection) {
      if (sortDirection.toLowerCase() == Direction.EqualOrMore) {
        where['quantity'] = MoreThanOrEqual(quantity);
      } else {
        where['quantity'] = LessThanOrEqual(quantity);
      }
    }
    if (price && sortDirection) {
      if (sortDirection.toLowerCase() == Direction.EqualOrMore) {
        where['price'] = MoreThanOrEqual(price);
      } else {
        where['price'] = LessThanOrEqual(price);
      }
    }
    if (category) {
      where['category'] = category;
    }
    if (sortBy && lowToHigh) {
      orderBy[sortBy] = lowToHigh ? 'ASC' : 'DESC';
    }

    inventory = await this.inventoryRepository.find({ where, order: orderBy });
    if (inventory.length != 0) {
      return this.responseHandlerService.response(
        null,
        HttpStatus.OK,
        'Filtered inventory fetched successfully',
        inventory,
      );
    } else {
      return this.responseHandlerService.response(
        null,
        HttpStatus.NO_CONTENT,
        'No product found in the inventory',
        inventory,
      );
    }
  }
}
