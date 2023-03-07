import {
  IsDefined,
  IsInt,
  IsMongoId,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  userId: number;

  @IsDefined()
  @IsString()
  @MinLength(1)
  content: string;

  @IsDefined()
  @IsMongoId()
  conversationId: string;
}
