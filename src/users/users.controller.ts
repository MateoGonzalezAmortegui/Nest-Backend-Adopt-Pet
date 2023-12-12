import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ConflictException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //*Functions
    private ConflictMessages(error: any) {
        if (error.keyPattern.email) {
            throw new ConflictException('Este Email ya esta registrado')
        }
        if (error.keyPattern.cellphone) {
            throw new ConflictException('Este numero ya esta registrado')
        }
    }

    @Post('sign-up')
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.usersService.create(createUserDto)
        } catch (error) {
            if (error.code === 11000) {
                this.ConflictMessages(error)
            }
        }
    }

    @Get(':id')
    async findOne(@Param('id', MongoIdPipe) id: string) {
        try {
            return await this.usersService.findOne(id)
        } catch (error) {
            return error
        }
    }

    @Patch(':id')
    async update(
        @Param('id', MongoIdPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            return await this.usersService.update(id, updateUserDto)
        } catch (error) {
            if (error.code === 11000) {
                this.ConflictMessages(error)
            }
        }
    }

    @Delete(':id')
    async remove(@Param('id', MongoIdPipe) id: string) {
        try {
            await this.usersService.remove(id)
            return { message: 'Usuario Borrado!' }
        } catch (error) {
            return error
        }
    }
}
