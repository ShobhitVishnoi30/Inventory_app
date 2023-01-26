import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  productName: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;

  @Column()
  category: string;
}
