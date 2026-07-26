import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without an Origin (Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, "0.0.0.0");

  console.log(
    `🚀 Backend running on port ${port} (${process.env.NODE_ENV || "development"})`,
  );
}

bootstrap().catch((err) => {
  console.error("❌ STARTUP ERROR:");
  console.error(err);
  process.exit(1);
});
