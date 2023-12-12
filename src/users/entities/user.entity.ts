import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class User {
    @Prop({ required: true })
    username: string

    @Prop({ unique: true, required: true, trim: true })
    email: string

    @Prop({ unique: true, required: true, trim: true })
    cellphone: string

    @Prop({ required: true })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
