import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  // private readonly để k public và k bao giờ rewrite lại productModel
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(
    title: string,
    desc: string,
    price: number,
  ): Promise<string> {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    console.log(result);
    return result.id as string;
  }

  async getProducts(): Promise<Product[]> {
    const results = await this.productModel.find();
    return results;
  }

  async getSingleProduct(productId: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: productId });
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ): Promise<Product> {
    let updatedProduct = await this.productModel.findOne({ _id: productId });
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    await updatedProduct.save();
    return updatedProduct;
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }
}
