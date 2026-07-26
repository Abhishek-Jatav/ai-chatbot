import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get("ping")
  ping() {
    return {
      success: true,
      message: "Pong!",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health")
  health() {
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbConnected = this.connection.readyState === 1;

    return {
      success: dbConnected,
      status: dbConnected ? "ok" : "degraded",
      db: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    };
  }
}
