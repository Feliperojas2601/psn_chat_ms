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
  // IsDefined, IsInt, IsPositive, Min(1)
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  userId: number;

  // IsDefined, IsString, Minlength(1)
  @IsDefined()
  @IsString()
  @MinLength(1)
  content: string;

  @IsDefined()
  @IsMongoId()
  conversationId: string;
}
