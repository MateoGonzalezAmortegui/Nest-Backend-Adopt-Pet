import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
} from '@nestjs/common'
import { PetsService } from './pets.service'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe'
import { updateImagesDto } from './dto/updateImages.dt'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Public } from 'src/auth/decorator/public.decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('pets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('file', 3))
    async create(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        files: Express.Multer.File[],
        @Body() createPetDto: CreatePetDto,
    ) {
        try {
            return await this.petsService.create(createPetDto, files)
        } catch (error) {
            return error
        }
    }

    @Public()
    @Get('all')
    async findAll() {
        try {
            return await this.petsService.findAll()
        } catch (error) {
            return error
        }
    }

    @Get(':id')
    async findOne(@Param('id', MongoIdPipe) id: string) {
        try {
            return this.petsService.findOne(id)
        } catch (error) {
            return error
        }
    }

    @Get('user/:id')
    async findUserPets(@Param('id', MongoIdPipe) id: string) {
        try {
            return await this.petsService.findUserPets(id)
        } catch (error) {
            return error
        }
    }

    @Patch('updateInfo/:id')
    async updateInfo(
        @Param('id', MongoIdPipe) id: string,
        @Body() updatePetDto: UpdatePetDto,
    ) {
        try {
            return await this.petsService.updateInfo(id, updatePetDto)
        } catch (error) {
            return error.response
        }
    }

    @Patch('updateImages/:id')
    @UseInterceptors(FilesInterceptor('file', 2))
    async updateImages(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        files: Express.Multer.File[],
        @Param('id', MongoIdPipe) id: string,
        @Body() updateImagesDto: updateImagesDto,
    ) {
        try {
            return await this.petsService.updateImages(
                id,
                updateImagesDto,
                files,
            )
        } catch (error) {
            return error
        }
    }

    @Delete(':id')
    async remove(@Param('id', MongoIdPipe) id: string) {
        try {
            await this.petsService.remove(id)
            return { message: 'Mascota Borrada!' }
        } catch (error) {
            return error.response
        }
    }
}
