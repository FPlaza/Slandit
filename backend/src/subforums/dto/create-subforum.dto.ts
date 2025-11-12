import { IsNotEmpty, IsOptional, IsString, MAX, MaxLength } from "class-validator";

export class CreateSubforumDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    displayName: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;
}
