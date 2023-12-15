import { Module } from '@nestjs/common'
import { PetsService } from './pets.service'
import { PetsController } from './pets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Pet, PetSchema } from './entities/pet.entity'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
    imports: [
        CloudinaryModule,
        MongooseModule.forFeature([
            {
                name: Pet.name,
                schema: PetSchema,
            },
        ]),
    ],
    controllers: [PetsController],
    providers: [PetsService],
})
export class PetsModule {}
