import { IsDefined, IsInt, IsMongoId, IsPositive, Min } from 'class-validator';

export class DeleteMessageDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  userId: number;

  @IsDefined()
  @IsMongoId()
  messageId: string;

  @IsDefined()
  @IsMongoId()
  conversationId: string;
}
