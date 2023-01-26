import { Injectable } from '@nestjs/common';
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

  async createInventory(inventory: InventoryDto): Promise<InventoryDto> {
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
      throw new Error(`Product with ${id} does not exists`);
    }
  }

  async updateInventory(
    id: string,
    updateInventory: UpdateInventoryDto,
  ): Promise<InventoryDto[]> {
    const inventory = await this.inventoryRepository.find({
      where: {
        id: id,
      },
    });

    if (inventory.length != 0) {
      const keys = Object.keys(updateInventory);

      keys.forEach((key) => {
        return (inventory[0][key] = updateInventory[key]);
      });

      await this.inventoryRepository.save(inventory);

      return inventory;
    } else {
      throw new Error('No such product exists');
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
      throw new Error('No such product exists');
    }
  }

  async getFilteredInventory(
    filterInventoryDto: FilterInventoryDto,
  ): Promise<any> {
    const keys = Object.keys(filterInventoryDto);
    //fetch all the product which has greater quantity
    let inventory: Inventory[];
    if (keys.length == 1) {
      if (keys.includes('quantity')) {
        inventory = await this.inventoryRepository.find({
          where: {
            quantity: MoreThanOrEqual(filterInventoryDto.quantity),
          },
        });
      }
      if (keys.includes('price')) {
        inventory = await this.inventoryRepository.find({
          where: {
            price: MoreThanOrEqual(filterInventoryDto.price),
          },
        });
      }
      if (keys.includes('category')) {
        inventory = await this.inventoryRepository.find({
          where: {
            category: filterInventoryDto.category,
          },
        });
      }
    } else if (keys.length == 2) {
      if (keys.includes('quantity') && keys.includes('category')) {
        inventory = await this.inventoryRepository.find({
          where: {
            quantity: MoreThanOrEqual(filterInventoryDto.quantity),
            category: filterInventoryDto.category,
          },
        });
      }
      if (keys.includes('price') && keys.includes('category')) {
        inventory = await this.inventoryRepository.find({
          where: {
            price: MoreThanOrEqual(filterInventoryDto.price),
            category: filterInventoryDto.category,
          },
        });
      }
    } else if (keys.length == 3) {
      if (
        keys.includes('quantity') &&
        keys.includes('category') &&
        keys.includes('moreThanGivenQuantity')
      ) {
        if (filterInventoryDto.moreThanGivenQuantity) {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: MoreThanOrEqual(filterInventoryDto.quantity),
              category: filterInventoryDto.category,
            },
          });
        } else {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: LessThanOrEqual(filterInventoryDto.quantity),
              category: filterInventoryDto.category,
            },
          });
        }
      }

      if (
        keys.includes('price') &&
        keys.includes('category') &&
        keys.includes('moreThanGivenPrice')
      ) {
        if (filterInventoryDto.moreThanGivenPrice) {
          inventory = await this.inventoryRepository.find({
            where: {
              price: MoreThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        } else {
          inventory = await this.inventoryRepository.find({
            where: {
              price: LessThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        }
      }
    } else {
      if (
        keys.includes('quantity') &&
        keys.includes('category') &&
        keys.includes('price')
      ) {
        if (
          filterInventoryDto.moreThanGivenPrice &&
          filterInventoryDto.moreThanGivenQuantity
        ) {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: MoreThanOrEqual(filterInventoryDto.quantity),
              price: MoreThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        } else if (
          filterInventoryDto.moreThanGivenPrice &&
          !filterInventoryDto.moreThanGivenQuantity
        ) {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: LessThanOrEqual(filterInventoryDto.quantity),
              price: MoreThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        } else if (
          !filterInventoryDto.moreThanGivenPrice &&
          filterInventoryDto.moreThanGivenQuantity
        ) {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: MoreThanOrEqual(filterInventoryDto.quantity),
              price: LessThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        } else if (
          !filterInventoryDto.moreThanGivenPrice &&
          !filterInventoryDto.moreThanGivenQuantity
        ) {
          inventory = await this.inventoryRepository.find({
            where: {
              quantity: LessThanOrEqual(filterInventoryDto.quantity),
              price: LessThanOrEqual(filterInventoryDto.price),
              category: filterInventoryDto.category,
            },
          });
        }
      }
    }

    return inventory;
  }
}

//if I save one more key then it's not throwing error or doing anything
