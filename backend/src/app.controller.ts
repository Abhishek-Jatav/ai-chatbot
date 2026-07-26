import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("ping")
  ping() {
    return {
      success: true,
      message: "Pong!",
      timestamp: new Date().toISOString(),
    };
  }
}
