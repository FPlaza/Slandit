import { PartialType } from '@nestjs/mapped-types';
import { CreateSubforumDto } from './create-subforum.dto';

export class UpdateSubforumDto extends PartialType(CreateSubforumDto) {}
