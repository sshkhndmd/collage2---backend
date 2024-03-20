import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('loadImage')
  @UseInterceptors(FilesInterceptor('images'))
  async loadImage(
    @UploadedFiles() images: any,
    @Body('user-id') userId: string
  ) {
    return this.appService.loadImages(images, userId)
  }

  @Get('user/:userId/images')
  async getUserImages(@Param('userId') userId: string) {
    return this.appService.getUserImages(userId);
  }

}
