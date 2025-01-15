import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // נקודת קצה לקבלת החדשות
  @Get()
  getNews() {
    return this.newsService.getNews();
  }
}
