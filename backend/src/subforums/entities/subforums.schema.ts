import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'subforums', timestamps: true})
export class Subforum {

    @Prop({ required: true, unique: true, index: true})
    name: string;

    @Prop({ required: true })
    displayName: string;

    @Prop()
    description: string;

    @Prop({ type: String, required: true})
    administrator: string;

    @Prop({ type: Number, default: 1})
    memberCount: number;

}

export const SubforumSchema = SchemaFactory.createForClass(Subforum);

export type SubforumDocument = Subforum & Document;