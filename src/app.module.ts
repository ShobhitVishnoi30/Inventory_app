import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('localhost').default('localhost'),
        PORT: Joi.number().default(3000),
        DB_PORT: Joi.number(),
        USERNAME: Joi.string(),
        PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true, //Wanted to make it false but other env variables need to be added in that case
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV,
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
