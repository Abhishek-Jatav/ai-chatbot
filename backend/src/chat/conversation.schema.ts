import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, trim: true })
  question!: string;

  @Prop({ required: true })
  answer!: string;

  @Prop({ default: Date.now })
  timestamp!: Date;

  @Prop({ index: "text" })
  searchText!: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Compound text index for full-text search on question + answer
ConversationSchema.index({
  question: "text",
  answer: "text",
});

// Index on timestamp for efficient sorting
ConversationSchema.index({
  timestamp: -1,
});
