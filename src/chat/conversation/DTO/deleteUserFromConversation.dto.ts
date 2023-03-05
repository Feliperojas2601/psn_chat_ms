import { IsDefined, IsInt, IsPositive, Min, IsMongoId } from 'class-validator';

export class DeleteUserFromConversationDto {
  // IsDefined, IsInt, IsPositive, Min(1)
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  memberId: number;

  @IsDefined()
  @IsMongoId()
  conversationId: string;
}
