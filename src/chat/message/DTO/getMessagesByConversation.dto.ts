import { IsDefined, IsInt, IsMongoId, IsPositive, Min } from 'class-validator';

export class GetMessagesByConversationDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  userId: number;

  @IsDefined()
  @IsMongoId()
  conversationId: string;
}
