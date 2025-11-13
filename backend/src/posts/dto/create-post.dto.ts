import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';

export class CreatePostDto {
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId({ message: 'El ID del subforo no es un MongoID válido' })
  @IsNotEmpty()
  subforumId: string;
}