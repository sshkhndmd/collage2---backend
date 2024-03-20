import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as fs from 'fs/promises';

@Injectable()
export class AppService {

  constructor(private readonly prismaService: PrismaService) {}

  async loadImages(images: any, userId: string) {
    const savedImages = [];

    for (const image of images) {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const imagePath = `images/${timestamp}_${image.originalname}`;

      savedImages.push(imagePath);

      await fs.writeFile(`${__dirname}/../uploads/${imagePath}`, image.buffer);
    }

    const user = await this.prismaService.user.findUnique({
      where: { 
        id: userId 
      }
    });

    if (!user) {
      throw new Error('Юзер не найден');
    }

    const createdImages = await this.prismaService.image.createMany({
      data: savedImages.map((path) => ({
        path,
        userId,
        filename: path.split('/').pop(),
      }))
    });

    return createdImages;
  }

  async getUserImages(userId: string) {
    const userImages = await this.prismaService.image.findMany({
      where: {
        userId: userId
      }
    }) 
    return userImages;
  }
}
