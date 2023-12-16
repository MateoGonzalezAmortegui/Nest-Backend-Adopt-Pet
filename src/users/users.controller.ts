import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    ConflictException,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

    //* Methods HTTP
    @Get(':id')
    async findOne(@Param('id', MongoIdPipe) id: string) {
        try {
            return await this.usersService.findOne(id)
        } catch (error) {
            return error.response
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
            return error.response
        }
    }

    @Delete(':id')
    async remove(@Param('id', MongoIdPipe) id: string) {
        try {
            await this.usersService.remove(id)
            return { message: 'Usuario Borrado!' }
        } catch (error) {
            return error.response
        }
    }
}
