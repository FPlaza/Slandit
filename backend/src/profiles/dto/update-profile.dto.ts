import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfileDto {
    
    @IsString()
    @IsOptional()
    bio?: string;

    @IsUrl()
    @IsOptional()
    avatarUrl?: string;
}