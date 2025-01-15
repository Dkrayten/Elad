import { Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class NewsService {
  private newsItems: any[] = []; // שמירת הנתונים שהתקבלו בזיכרון

  // מאזין ל-RabbitMQ עבור הודעות בתור 'news_queue_1'
  @EventPattern('news_queue_1') // שם התור צריך להתאים להגדרה ב-RabbitMQ וב-Python
  async handleNewsMessage(@Payload() data: any, @Ctx() context: RmqContext) {
      console.log('Received news item:', data);
      
      // שמור את הנתונים
      this.newsItems.push(data);
  
      // אשר את קבלת ההודעה
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);
  }
  

  // פונקציה להחזרת החדשות המאוחסנות
  getNews() {
    return this.newsItems;
  }
}
