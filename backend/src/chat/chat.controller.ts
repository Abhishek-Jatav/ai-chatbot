import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from './chat.service';
import { GeminiService } from '../gemini/gemini.service';
import { AskQuestionDto } from './chat.dto';
import { Conversation, ConversationDocument } from './conversation.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly geminiService: GeminiService,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  @Post('ask')
  @HttpCode(HttpStatus.CREATED)
  async askQuestion(@Body() dto: AskQuestionDto) {
    const conversation = await this.chatService.askQuestion(dto);
    return { success: true, data: conversation };
  }

  @Post('ask/stream')
  async askQuestionStream(@Body() dto: AskQuestionDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    let fullAnswer = '';
    try {
      const stream = await this.geminiService.generateAnswerStream(dto.question);
      for await (const chunk of stream) {
        const text = chunk.text();
        fullAnswer += text;
        res.write(`data: ${JSON.stringify({ chunk: text, done: false })}\n\n`);
      }
      const conversation = await this.conversationModel.create({
        question: dto.question,
        answer: fullAnswer,
        timestamp: new Date(),
      });
      res.write(`data: ${JSON.stringify({ chunk: '', done: true, id: conversation._id })}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'Streaming failed. Please try again.', done: true })}\n\n`);
    } finally {
      res.end();
    }
  }

  @Get('history')
  async getHistory(@Query('page') page = '1', @Query('limit') limit = '20') {
    const result = await this.chatService.getConversations(parseInt(page), parseInt(limit));
    return { success: true, ...result };
  }

  @Get('search')
  async searchConversations(@Query('q') query: string) {
    const results = await this.chatService.searchConversations(query || '');
    return { success: true, data: results, total: results.length };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.chatService.getStats();
    return { success: true, data: stats };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteConversation(@Param('id') id: string) {
    const result = await this.chatService.deleteConversation(id);
    return { success: true, ...result };
  }
}
