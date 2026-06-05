import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  @IsNotEmpty()
  question!: string;
}

export class SearchConversationsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}
