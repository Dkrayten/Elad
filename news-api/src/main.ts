import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // חיבור ל-RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // כתובת RabbitMQ
      queue: 'news_queue_1', // שם ה-Queue
      queueOptions: {
        durable: true, // התאמה ל-Queue מוגדר עם durable
      },
    },
  });
  

  await app.startAllMicroservices(); // הפעלת המיקרוסרביסים
  await app.listen(3000);
}
bootstrap();
