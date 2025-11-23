import { IsString, IsNotEmpty, MaxLength, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @IsMongoId()
  @IsOptional()
  parentId?: string;
}