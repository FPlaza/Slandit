import { IsString, IsNotEmpty, MaxLength, IsOptional, IsUrl } from 'class-validator';

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

    @IsUrl()
    @IsOptional()
    icon?: string;

    @IsUrl()
    @IsOptional()
    banner?: string;
}