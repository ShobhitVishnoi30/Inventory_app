import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    // NOTE: Since the env file name will be ".env.stage.<STAGE_NAME>", you should mention the filePath
    // NOTE: Add JOI Validation for envs
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.environment,
      port: +process.env.DB_PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        path.join(__dirname, '**', '**', '*.entity{.ts,.js}'),
        path.join(__dirname, '**', '**', '*.entities{.ts,.js}'),
      ],
      synchronize: true,
    }),
    InventoryModule,
  ],
})
export class AppModule {}
