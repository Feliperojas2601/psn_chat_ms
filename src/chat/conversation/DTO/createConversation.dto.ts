import {
  IsDefined,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateConversationDto {
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Min(1, { each: true })
  membersId: number[];
}
