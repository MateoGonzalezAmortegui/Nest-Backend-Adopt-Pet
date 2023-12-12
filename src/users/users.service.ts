import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

//* Database
import { InjectModel } from '@nestjs/mongoose'
import { User } from './entities/user.entity'
import { Model, Types } from 'mongoose'

//* External
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    //* Functions
    private NoPassword(user: any) {
        const { password, ...newUserData } = user.toJSON()
        return newUserData
    }

    //* Methods
    async create(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto)
        newUser.password = await bcrypt.hash(newUser.password, 10)
        await newUser.save()
        return this.NoPassword(newUser)
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id)
        return this.NoPassword(user)
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(id)
        const updateUser = await this.userModel.findByIdAndUpdate(
            id,
            { $set: updateUserDto },
            { new: true },
        )

        if (user.password !== updateUser.password) {
            updateUser.password = await bcrypt.hash(updateUser.password, 10)
            await updateUser.save()
        }
        return this.NoPassword(updateUser)
    }

    async remove(id: string) {
        return await this.userModel.findByIdAndDelete(id)
    }
}
