import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderMethod } from '@prisma/client';

export class CreateOrderLineItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class CreateOrderDto {
  @IsUUID()
  shopId: string;

  @Type(() => Number)
  @IsNumber()
  subtotal: number;

  @Type(() => Number)
  @IsNumber()
  deliveryFee: number;

  @Type(() => Number)
  @IsNumber()
  tax: number;

  @Type(() => Number)
  @IsNumber()
  total: number;

  @IsEnum(OrderMethod)
  method: OrderMethod;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  etaMinutes?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineItemDto)
  items: CreateOrderLineItemDto[];
}