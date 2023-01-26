import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryDto } from 'src/Dto/createInventory.dto';
import { FilterInventoryDto } from 'src/Dto/filterInventory.dto';
import { UpdateInventoryDto } from 'src/Dto/updateInventory.dto';
import { Inventory } from 'src/Entity/inventory.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async insertProduct(inventory: InventoryDto): Promise<InventoryDto> {
    const data = this.inventoryRepository.create(inventory);
    const savedInventory = await this.inventoryRepository.save(data);
    return savedInventory;
  }

  async getAllInventory(): Promise<InventoryDto[]> {
    return await this.inventoryRepository.find();
  }

  async getInventoryById(id: string): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.find({
      where: {
        id: id,
      },
    });
    if (inventory.length != 0) {
      return inventory[0];
    } else {
      throw new NotFoundException(`Product with ${id} does not exists`);
    }
  }

  async updateInventory(
    id: string,
    updateInventory: UpdateInventoryDto,
  ): Promise<InventoryDto> {
    let inventory = await this.inventoryRepository.findOneBy({ id: id });

    if (inventory) {
      const keys = Object.keys(updateInventory);
      keys.forEach((key) => {
        if (updateInventory[key]) {
          return (inventory[key] = updateInventory[key]);
        }
      });
      inventory = await this.inventoryRepository.save(inventory);
      return inventory;
    } else {
      throw new NotFoundException('No such product exists');
    }
  }

  async deleteInventory(id: string): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.find({
      where: {
        id: id,
      },
    });
    if (inventory.length != 0) {
      await this.inventoryRepository.delete(id);
      return inventory[0];
    } else {
      throw new NotFoundException('No such product exists');
    }
  }

  async filteredInventory(
    filterInventoryDto: FilterInventoryDto,
  ): Promise<InventoryDto[]> {
    let where = {};
    let orderBy = {};
    let inventory: Inventory[];

    const {
      productName,
      category,
      price,
      quantity,
      moreThanGivenPrice,
      moreThanGivenQuantity,
      sortByName,
      sortByPrice,
      sortByQuantity,
    } = filterInventoryDto;

    if (productName) {
      where['productName'] = productName;
    }
    if (quantity) {
      if (moreThanGivenQuantity) {
        where['quantity'] = MoreThanOrEqual(quantity);
      } else {
        where['quantity'] = LessThanOrEqual(quantity);
      }
    }
    if (price) {
      if (moreThanGivenPrice) {
        where['price'] = MoreThanOrEqual(price);
      } else {
        where['price'] = LessThanOrEqual(price);
      }
    }
    if (category) {
      where['category'] = category;
    }

    orderBy['productName'] = sortByName ? 'ASC' : 'DESC';
    orderBy['price'] = sortByPrice ? 'ASC' : 'DESC';
    orderBy['quantity'] = sortByQuantity ? 'ASC' : 'DESC';

    inventory = await this.inventoryRepository.find({ where, order: orderBy });
    if (inventory.length != 0) {
      return inventory;
    } else {
      throw new NotFoundException('No product found');
    }
  }
}
