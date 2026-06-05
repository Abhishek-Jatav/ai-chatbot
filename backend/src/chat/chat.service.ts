import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Conversation, ConversationDocument } from "./conversation.schema";
import { GeminiService } from "../gemini/gemini.service";
import { AskQuestionDto } from "./chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async askQuestion(dto: AskQuestionDto): Promise<ConversationDocument> {
    try {
      const answer = await this.geminiService.generateAnswer(dto.question);

      const conversation = new this.conversationModel({
        question: dto.question,
        answer,
        timestamp: new Date(),
      });

      return await conversation.save();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes("API")) {
        throw new InternalServerErrorException(
          "AI service is unavailable. Please try again later.",
        );
      }

      throw new InternalServerErrorException(
        "Failed to process your question. Please try again.",
      );
    }
  }

  async getConversations(
    page = 1,
    limit = 20,
  ): Promise<{
    data: ConversationDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.conversationModel
          .find()
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.conversationModel.countDocuments(),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (_error: unknown) {
      throw new InternalServerErrorException("Failed to fetch conversations.");
    }
  }

  async searchConversations(query: string): Promise<ConversationDocument[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      // Try full-text search first
      try {
        const results = await this.conversationModel
          .find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } },
          )
          .sort({ score: { $meta: "textScore" } })
          .limit(20)
          .exec();

        if (results.length > 0) {
          return results;
        }
      } catch {
        // Fall through to regex search
      }

      // Regex fallback
      const regex = new RegExp(query, "i");

      return await this.conversationModel
        .find({
          $or: [{ question: regex }, { answer: regex }],
        })
        .sort({ timestamp: -1 })
        .limit(20)
        .exec();
    } catch (_error: unknown) {
      throw new InternalServerErrorException("Failed to search conversations.");
    }
  }

  async deleteConversation(id: string): Promise<{ message: string }> {
    try {
      const result = await this.conversationModel.findByIdAndDelete(id);

      if (!result) {
        throw new NotFoundException("Conversation not found.");
      }

      return {
        message: "Conversation deleted successfully.",
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException("Failed to delete conversation.");
    }
  }

  async getStats(): Promise<{
    total: number;
    todayCount: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [total, todayCount] = await Promise.all([
        this.conversationModel.countDocuments(),
        this.conversationModel.countDocuments({
          timestamp: { $gte: today },
        }),
      ]);

      return {
        total,
        todayCount,
      };
    } catch (_error: unknown) {
      throw new InternalServerErrorException("Failed to fetch statistics.");
    }
  }
}
