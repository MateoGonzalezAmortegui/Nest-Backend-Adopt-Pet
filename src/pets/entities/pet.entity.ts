import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ImagesDto } from '../dto/images-pet.dt'
import { VaccinationsDto } from '../dto/vaccinations-pet.dto'

@Schema()
export class Pet {
    @Prop({ required: true, trim: true })
    name: string

    @Prop({ required: true })
    animal: string

    @Prop({ required: true })
    breed: string

    @Prop({ required: true, trim: true })
    description: string

    @Prop({ required: true })
    gender: string

    @Prop({ required: true })
    years: string

    @Prop()
    months: string

    @Prop({ required: true })
    latitude: string

    @Prop({ required: true })
    longitude: string

    @Prop({ type: [VaccinationsDto], trim: true }) //* Object Array
    vaccinations: VaccinationsDto[]

    @Prop({ type: [ImagesDto] })
    images: ImagesDto[]
}

export const PetSchema = SchemaFactory.createForClass(Pet)
