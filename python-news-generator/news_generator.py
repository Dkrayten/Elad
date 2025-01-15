import pika
import json
import random
import time
from datetime import datetime

# הגדרות חיבור ל-RabbitMQ
RABBITMQ_HOST = 'localhost'  # כתובת RabbitMQ
QUEUE_NAME = 'news_queue'  # שם התור שבו נשתמש

# קטגוריות לדוגמה
CATEGORIES = ["Technology", "Business", "World", "Science"]

# פונקציה ליצירת חדשות מדומות
def generate_news():
    title = f"Breaking News {random.randint(1, 100)}"
    content = "This is a simulated news content."
    category = random.choice(CATEGORIES)
    timestamp = datetime.now().isoformat()
    keywords = ["news", category.lower(), "breaking"]
    return {
        "title": title,
        "content": content,
        "category": category,
        "timestamp": timestamp,
        "keywords": keywords,
    }

# התחברות ל-RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
channel = connection.channel()

# יצירת תור (אם לא קיים)
channel.queue_declare(queue=QUEUE_NAME, durable=True)

try:
    while True:
        # יצירת פריט חדשות ושליחתו ל-RabbitMQ
        news_item = generate_news()
        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_NAME,
            body=json.dumps(news_item),
            properties=pika.BasicProperties(
                delivery_mode=2,  # הפיכת ההודעה לעמידה
            ),
        )
        print(f"Published news: {news_item}")
        time.sleep(random.randint(5, 10))  # המתנה בין 5 ל-10 שניות
except KeyboardInterrupt:
    print("Stopped publishing news.")
finally:
    connection.close()
