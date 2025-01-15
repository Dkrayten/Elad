import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class NewsService {
  private readonly RABBITMQ_URL = 'amqp://localhost';
  private readonly QUEUE_NAME = 'news_queue_1';

  async consumeMessages(): Promise<any[]> {
    const connection = await amqp.connect(this.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(this.QUEUE_NAME, { durable: true });

    const messages = [];
    await new Promise<void>((resolve) => {
      channel.consume(
        this.QUEUE_NAME,
        (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            messages.push(content);
            channel.ack(msg);
          }
        },
        { noAck: false }
      );

      // לאחר מספר שניות עוצרים את הצריכה
      setTimeout(() => {
        resolve();
        channel.close();
        connection.close();
      }, 5000); // 5 שניות לצריכת הודעות
    });

    return messages;
  }
}
