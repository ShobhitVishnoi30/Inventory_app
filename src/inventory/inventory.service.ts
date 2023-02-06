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

  // async insertProduct(inventory: InventoryDto): Promise<InventoryDto> {
  //   const data = this.inventoryRepository.create(inventory);
  //   const savedInventory = await this.inventoryRepository.save(data);
  //   return savedInventory;

  //   // NOTE: need to work on variable naming convention
  //   // NOTE: observe this function rewritten below
  // }
  async insertProduct(inventoryDto: InventoryDto): Promise<InventoryDto> {
    // Perform operation if you have to do on the DTO data
    let inventory = this.inventoryRepository.create(inventoryDto);
    
    inventory = await this.inventoryRepository.save(inventory);

    return inventory;
  }

  async getAllInventory(): Promise<InventoryDto[]> {
    return await this.inventoryRepository.find();
  }

  async getInventoryById(id: string): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.find({ // NOTE: use findOne
      where: {
        id: id, // NOTE: use es6 syntaxes
      },
    });
    if (inventory.length != 0) {
      return inventory[0];
    } else {
      throw new NotFoundException(`Product with ${id} does not exists`); // NOTE: Do not log ID which reveals ID format
    }
  }

  async updateInventory(
    id: string,
    updateInventory: UpdateInventoryDto,
  ): Promise<InventoryDto> {
    let inventory = await this.inventoryRepository.findOneBy({ id: id }); // NOTE: use ES6 syntaxes

    // NOTE: Use Guard-clause technique for conditionals

    if (inventory) {
      const keys = Object.keys(updateInventory);
      keys.forEach((key) => {
        if (updateInventory[key]) {
          return (inventory[key] = updateInventory[key]); // NOTE: Use ES6 syntaxes to write this logic better
        }
      });
      inventory = await this.inventoryRepository.save(inventory);
      return inventory;
    } else {
      throw new NotFoundException('No such product exists');
    }
  }

  async deleteInventory(id: string): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.find({ // NOTE: Un-necessary code, can use findOne just in case
      where: {
        id: id,
      },
    });
    if (inventory.length != 0) {
      await this.inventoryRepository.delete(id); // NOTE: checking it's existence is not requires, you can velidate by the number of records deleted
      return inventory[0]; // NOTE: In case of deletion, the 304 is sent which is No Content or send 200 with status "ok"
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

// FIXME: You may need to rewrite this functionality after all infront of me

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

    // BUG: Wrong logic
    orderBy['productName'] = sortByName ? 'ASC' : 'DESC';
    orderBy['price'] = sortByPrice ? 'ASC' : 'DESC';
    orderBy['quantity'] = sortByQuantity ? 'ASC' : 'DESC';

    inventory = await this.inventoryRepository.find({ where, order: orderBy });
    if (inventory.length != 0) {
      return inventory;
    } else {
      throw new NotFoundException('No product found'); // NOTE: Having no result in-case there isn't any, is a result, not an exception
    }
  }
}
