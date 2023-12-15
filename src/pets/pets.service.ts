import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Pet } from './entities/pet.entity'
import { Model } from 'mongoose'

//* External
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { updateImagesDto } from './dto/updateImages.dt'

@Injectable()
export class PetsService {
    constructor(
        @InjectModel(Pet.name) private petModel: Model<Pet>,
        private cloudinaryService: CloudinaryService,
    ) {}

    //* Variables
    private options = {
        width: 400,
        height: 300,
        crop: 'fit',
    }

    //* Functions
    async create(createPetDto: CreatePetDto, files: Express.Multer.File[]) {
        const newFiles = await this.cloudinaryService.uploadFiles(
            files,
            this.options,
        )
        const newPet = new this.petModel(createPetDto)
        newPet.images = newFiles.map((element) => ({
            public_id: element.public_id,
            secure_url: element.secure_url,
        }))
        return await newPet.save()
    }

    async findAll() {
        return await this.petModel.find()
    }

    async findOne(id: string) {
        const pet = await this.petModel.findById(id)
        if (!pet) {
            throw new NotFoundException(`Mascota no encontrada`)
        }
        return pet
    }

    async findUserPets(id: string) {
        return await this.petModel.find({ userId: id })
    }

    async updateInfo(id: string, updatePetDto: UpdatePetDto) {
        await this.findOne(id)
        const updatePet = await this.petModel.findByIdAndUpdate(
            id,
            { $set: updatePetDto },
            { new: true },
        )
        return updatePet
    }

    async updateImages(
        id: string,
        updateImagesDto: updateImagesDto,
        files: Express.Multer.File[],
    ) {
        const findPet = await this.findOne(id)
        const newFiles = await this.cloudinaryService.uploadFiles(
            files,
            this.options,
        )
        try {
            updateImagesDto.indexes.map(async (element, index) => {
                await this.cloudinaryService.deleteFile(
                    findPet.images[element].public_id,
                )
                findPet.images[element] = {
                    public_id: newFiles[index].public_id,
                    secure_url: newFiles[index].secure_url,
                }
            })
        } catch (error) {}

        const updateImagesPet = await this.petModel.findByIdAndUpdate(
            id,
            { $set: findPet },
            { new: true },
        )
        return updateImagesPet
    }

    async remove(id: string) {
        const deletePet = await this.findOne(id)
        try {
            await this.cloudinaryService.deleteFile(
                deletePet.images[0].public_id,
            )
            await this.cloudinaryService.deleteFile(
                deletePet.images[1].public_id,
            )
            await this.cloudinaryService.deleteFile(
                deletePet.images[2].public_id,
            )
        } catch (error) {}

        return await this.petModel.findByIdAndDelete(id)
    }
}
