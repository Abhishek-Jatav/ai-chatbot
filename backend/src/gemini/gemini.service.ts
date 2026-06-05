import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);

  private genAI!: GoogleGenerativeAI;
  private model!: GenerativeModel;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");

    if (!apiKey) {
      this.logger.error("GEMINI_API_KEY is not set");
      throw new Error("GEMINI_API_KEY is required");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
      systemInstruction: `
You are a helpful, knowledgeable FAQ assistant.

Provide clear, concise and accurate answers.
Use markdown when helpful.
Remain friendly and professional.
      `,
    });

    this.logger.log("Gemini AI initialized successfully");
  }

  async generateAnswer(question: string): Promise<string> {
    try {
      const result = await this.model.generateContent(question);

      return result.response.text();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Gemini API error: ${message}`);

      throw new Error(`AI API Error: ${message}`);
    }
  }

  async generateAnswerStream(question: string) {
    try {
      const result = await this.model.generateContentStream(question);

      return result.stream;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Gemini streaming error: ${message}`);

      throw new Error(`AI Streaming Error: ${message}`);
    }
  }
}
