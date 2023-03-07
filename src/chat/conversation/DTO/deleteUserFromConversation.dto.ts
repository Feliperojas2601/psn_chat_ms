import { IsDefined, IsInt, IsPositive, Min, IsMongoId } from 'class-validator';

export class DeleteUserFromConversationDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  memberId: number;

  @IsDefined()
  @IsMongoId()
  conversationId: string;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  userId: number;
}
