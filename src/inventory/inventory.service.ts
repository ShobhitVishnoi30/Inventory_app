import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterInventoryDto,
  InventoryDto,
  UpdateInventoryDto,
} from 'src/Dto/inventory.dto';
import { Inventory } from 'src/Entity/inventory.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async createInventory(createInventory: InventoryDto): Promise<any> {
    const data = this.inventoryRepository.create(createInventory);
    const savedUser = await this.inventoryRepository.save(data);
    return savedUser;
  }

  async getInventory(): Promise<any> {
    return await this.inventoryRepository.find();
  }

  async updateInventory(
    id: number,
    updateInventory: UpdateInventoryDto,
  ): Promise<any> {
    const inventory = await this.inventoryRepository.find({
      where: {
        id,
      },
    });

    const keys = Object.keys(updateInventory);

    keys.forEach((key) => {
      return (inventory[0][key] = updateInventory[key]);
    });

    return await this.inventoryRepository.save(inventory);
  }

  async deleteInventory(id: number): Promise<any> {
    return await this.inventoryRepository.delete(id);
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
